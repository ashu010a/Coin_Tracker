import 'dotenv/config';
import express from "express";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT_TRON || 4000;

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

// 🗝️ API Keys
const TRON_API_KEY = process.env.TRON_API_KEY || "f66c1cdc-fef1-4e7a-8e4b-f467a3475bc4";
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://solana-mainnet.g.alchemy.com/v2/UobFJAojTbHia1QN8j1F2";
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

// 🧠 Fetch TRC20 Balance
async function getTRC20Balance(wallet) {
  const url = `https://apilist.tronscan.org/api/account?address=${wallet}`;
  const { data } = await axios.get(url);
  return data.balance ? data.balance / 1e6 : 0;
}

// 🧠 Fetch TRC20 Transfers
async function getTRC20Transfers(wallet) {
  const url = `https://apilist.tronscanapi.com/api/token_trc20/transfers?relatedAddress=${wallet}&limit=5&sort=-timestamp`;
  const headers = { "TRON-PRO-API-KEY": TRON_API_KEY };
  const { data } = await axios.get(url, { headers });

  if (!data || !data.token_transfers) throw new Error("No TRC20 transfer data found.");

  return data.token_transfers.map((tx) => ({
    transaction_id: tx.transaction_id,
    from: tx.from_address,
    to: tx.to_address,
    amount: tx.quant ? tx.quant / 1e6 : null,
    timestamp: new Date(tx.block_ts).toISOString(),
  }));
}

// 🧠 Fetch BTC Balance and Transactions
async function getBTCData(wallet) {
  const balanceUrl = `https://blockchain.info/q/addressbalance/${wallet}`;
  const balanceResponse = await axios.get(balanceUrl);
  const balance = parseFloat(balanceResponse.data) / 1e8;

  const txUrl = `https://api.blockcypher.com/v1/btc/main/addrs/${wallet}?limit=5`;
  const txResponse = await axios.get(txUrl);
  const txrefs = txResponse.data.txrefs || [];

  const transfers = await Promise.all(txrefs.map(async (tx) => {
    const txDetailUrl = `https://api.blockcypher.com/v1/btc/main/txs/${tx.tx_hash}`;
    const txDetail = await axios.get(txDetailUrl);
    const txData = txDetail.data;

    const inputs = txData.inputs.map(inp => inp.addresses ? inp.addresses[0] : 'Unknown').join(', ');
    const outputs = txData.outputs.map(out => ({ address: out.addresses ? out.addresses[0] : 'Unknown', amount: out.value / 1e8 }));

    return {
      transaction_id: tx.tx_hash,
      from: inputs,
      to: outputs.map(o => o.address).join(', '),
      amount: outputs.reduce((sum, o) => sum + o.amount, 0),
      timestamp: new Date(txData.confirmed).toISOString(),
    };
  }));

  return { balance, transfers };
}

// 🧠 Fetch Solana Balance and Transactions
async function getSolanaData(wallet) {
  // Balance
  const balanceResponse = await axios.post(SOLANA_RPC_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "getBalance",
    params: [wallet]
  });
  const balance = balanceResponse.data.result.value / 1e9;

  // Transactions
  const sigResponse = await axios.post(SOLANA_RPC_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "getSignaturesForAddress",
    params: [wallet, { limit: 5 }]
  });
  const signatures = sigResponse.data.result.map(sig => sig.signature);

  const transfers = await Promise.all(signatures.map(async (sig) => {
    const txResponse = await axios.post(SOLANA_RPC_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "getTransaction",
      params: [sig, { encoding: "jsonParsed" }]
    });
    const tx = txResponse.data.result;
    if (!tx) return null;

    const blockTime = tx.blockTime;
    const timestamp = new Date(blockTime * 1000).toISOString();

    // Simplified transfer extraction (similar to Python logic)
    const instructions = tx.transaction.message.instructions;
    let fromAddr = wallet;
    let toAddr = 'Unknown';
    let amount = 0;

    for (const ins of instructions) {
      if (ins.parsed && ins.parsed.type === 'transfer') {
        const info = ins.parsed.info;
        fromAddr = info.source || info.authority || wallet;
        toAddr = info.destination;
        amount = info.lamports ? info.lamports / 1e9 : (info.tokenAmount ? info.tokenAmount.uiAmount : 0);
      }
    }

    return {
      transaction_id: sig,
      from: fromAddr,
      to: toAddr,
      amount,
      timestamp,
    };
  }));

  return { balance, transfers: transfers.filter(tx => tx !== null) };
}

// 🏠 Root route
app.get("/", (req, res) => {
  res.send("🚀 TRON TRC20 Wallet Tracker API is Live");
});

// AI health check
app.get("/api-ai/health", async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ ok: false, reason: "GEMINI_API_KEY not configured" });
    return res.json({ ok: true, model: GEMINI_MODEL });
  } catch (e) {
    return res.status(500).json({ ok: false, reason: e.message });
  }
});

// 🪙 API route: /api/tr20/:wallet
app.get("/api/tr20/:wallet", async (req, res) => {
  const { wallet } = req.params;

  if (!wallet) return res.status(400).json({ error: "Wallet address required" });

  try {
    const balance = await getTRC20Balance(wallet);
    const transfers = await getTRC20Transfers(wallet);
    res.json({
      chain: "tron",
      wallet,
      balance,
      transfer_count: transfers.length,
      transfers,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🪙 API route: /api/btc/:wallet
app.get("/api/btc/:wallet", async (req, res) => {
  const { wallet } = req.params;

  if (!wallet) return res.status(400).json({ error: "Wallet address required" });

  try {
    const { balance, transfers } = await getBTCData(wallet);
    res.json({
      chain: "btc",
      wallet,
      balance,
      transfer_count: transfers.length,
      transfers,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🪙 API route: /api/sol/:wallet
app.get("/api/sol/:wallet", async (req, res) => {
  const { wallet } = req.params;

  if (!wallet) return res.status(400).json({ error: "Wallet address required" });

  try {
    const { balance, transfers } = await getSolanaData(wallet);
    res.json({
      chain: "solana",
      wallet,
      balance,
      transfer_count: transfers.length,
      transfers,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI: Summarize wallet data (BTC/TRON/SOL)
app.post("/api-ai/summary", express.json(), async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    const { chain, address, balance, transfers } = req.body || {};
    const prompt = `You are an expert blockchain analyst. Summarize this wallet concisely for a dashboard.\nChain: ${chain}\nAddress: ${address}\nBalance: ${balance}\nRecent Transfers (max 10): ${JSON.stringify(transfers || []).slice(0, 6000)}\nProvide:\n- Current balance and rough USD equivalent (assume BTC $65000, SOL $150, USDT $1)\n- Activity overview (incoming vs outgoing, last activity time)\n- Notable patterns or risks\n- 2-3 actionable insights for the user`;
    const text = await generateWithGemini(GEMINI_MODEL, prompt);
    return res.json({ summary: text });
  } catch (e) {
    console.error("/api-ai/summary error:", e);
    return res.status(500).json({ error: e.message || "AI summary failed" });
  }
});

// AI: Chat about wallet data (BTC/TRON/SOL)
app.post("/api-ai/chat", express.json(), async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    const { chain, address, balance, transfers, question } = req.body || {};
    if (!question) return res.status(400).json({ error: "question is required" });
    const system = `You are a helpful crypto wallet analyst. Only answer questions grounded in the provided data. If a question is unrelated or requires external data, reply that you can only answer based on the provided response.`;
    const context = `Wallet Context:\nChain: ${chain}\nAddress: ${address}\nBalance: ${balance}\nTransfers: ${JSON.stringify(transfers || []).slice(0, 6000)}`;
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

app.listen(PORT, () => console.log(`✅ Multi-Chain Wallet Tracker API running on port ${PORT}`));

export default app;
