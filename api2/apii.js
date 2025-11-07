import 'dotenv/config';
import express from "express";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "RTH2U5Q3D9GZZ521DWQVPX2JV5K6QXM5A7";
const BASE_URL = "https://api.etherscan.io/v2/api";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"; // default per latest quickstart
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Fallback: direct REST call to Gemini API to avoid SDK/version issues
async function generateWithGemini(model, prompt) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const { data } = await axios.post(
    endpoint,
    {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      params: { key: GEMINI_API_KEY },
    }
  );
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  return text;
}

const CHAIN_IDS = {
  ethereum: 1,
  polygon: 137,
  arbitrum: 42161,
  base: 8453,
  avalanche: 43114,
};

async function getNativeBalance(address, chain) {
  const params = {
    chainid: CHAIN_IDS[chain],
    module: "account",
    action: "balance",
    address,
    apikey: ETHERSCAN_API_KEY,
  };
  const { data } = await axios.get(BASE_URL, { params });
  if (data.status === "1") return parseFloat(data.result) / 1e18;
  else throw new Error(data.message || "Balance fetch failed");
}

async function getLatestTransactions(address, chain, limit = 5) {
  const params = {
    chainid: CHAIN_IDS[chain],
    module: "account",
    action: "txlist",
    address,
    sort: "desc",
    apikey: ETHERSCAN_API_KEY,
  };
  const { data } = await axios.get(BASE_URL, { params });
  if (data.status === "1")
    return data.result.slice(0, limit).map((tx) => ({
      from: tx.from,
      to: tx.to,
      value: parseFloat(tx.value) / 1e18,
      hash: tx.hash,
      time: new Date(tx.timeStamp * 1000).toISOString(),
    }));
  else throw new Error(data.message || "Transaction fetch failed");
}

app.get("/", (req, res) => {
  res.send("🚀 Multi-Chain Wallet Tracker API is Live");
});

// AI health check
app.get("/api-ai/health", async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ ok: false, reason: "GEMINI_API_KEY not configured" });
    // lightweight no-op
    return res.json({ ok: true, model: GEMINI_MODEL });
  } catch (e) {
    return res.status(500).json({ ok: false, reason: e.message });
  }
});

// Wallet API route: /api/:chain/:address
app.get("/api/:chain/:address", async (req, res) => {
  const { chain, address } = req.params;
  if (!CHAIN_IDS[chain]) return res.status(400).json({ error: "Unsupported chain" });
  if (!address.startsWith("0x")) return res.status(400).json({ error: "Invalid address" });

  try {
    const [balance, transactions] = await Promise.all([
      getNativeBalance(address, chain),
      getLatestTransactions(address, chain),
    ]);

    res.json({
      chain,
      address,
      balance,
      transactions,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI: Summarize wallet data
app.post("/api-ai/summary", express.json(), async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    const { chain, address, balance, transactions } = req.body || {};
    const prompt = `You are an expert blockchain analyst. Summarize this wallet concisely for a dashboard.
Chain: ${chain}\nAddress: ${address}\nBalance: ${balance}\nRecent Transactions (max 10): ${JSON.stringify(transactions || []).slice(0, 6000)}
Provide:
- Current balance and rough USD equivalent (assume ETH $2500 if needed)
- Activity overview (incoming vs outgoing, last activity time)
- Notable patterns or risks
- 2-3 actionable insights for the user`;
    const text = await generateWithGemini(GEMINI_MODEL, prompt);
    return res.json({ summary: text });
  } catch (e) {
    console.error("/api-ai/summary error:", e);
    return res.status(500).json({ error: e.message || "AI summary failed" });
  }
});

// AI: Chat about wallet data (question must relate to provided data)
app.post("/api-ai/chat", express.json(), async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    const { chain, address, balance, transactions, question } = req.body || {};
    if (!question) return res.status(400).json({ error: "question is required" });
    const system = `You are a helpful crypto wallet analyst. Only answer questions grounded in the provided data. If a question is unrelated or requires external data, reply with a brief note that you can only answer based on the provided response.`;
    const context = `Wallet Context:\nChain: ${chain}\nAddress: ${address}\nBalance: ${balance}\nTransactions: ${JSON.stringify(transactions || []).slice(0, 6000)}`;
    const user = `Question: ${question}`;
    const text = await generateWithGemini(
      GEMINI_MODEL,
      `${system}\n\n${context}\n\n${user}`
    );
    return res.json({ answer: text });
  } catch (e) {
    console.error("/api-ai/chat error:", e);
    return res.status(500).json({ error: e.message || "AI chat failed" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;