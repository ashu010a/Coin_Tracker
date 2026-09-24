# 🔎 Crypto-Trace (Coin_Tracker)

> **Real-Time Multi-Chain Cryptocurrency Monitoring & Investigation Platform**

Crypto-Trace is a blockchain investigation platform that brings wallet analysis, transaction tracking, multi-chain monitoring, AI-assisted analysis, and investigation-ready data into a single interface.

## ✨ Features

- 🌐 **Multi-chain monitoring** — Ethereum, Base, Polygon, Arbitrum, Avalanche, Solana, TRON, and Bitcoin
- 💰 **Wallet analysis** — balances and recent transaction history
- 🔍 **Transaction inspection** — detailed on-chain transaction data
- 🚨 **Suspicious wallet tracking** — monitor addresses and activity
- 🤖 **AI analysis** — Gemini-powered transaction summaries and contextual analysis
- 💬 **AI chat assistant** — ask questions about the wallet's retrieved on-chain data
- 📊 **Interactive dashboard** — modern dark-themed investigation interface

## 🏗️ Architecture

```text
User
  │
  ▼
React / Vite Frontend
  │
  ▼
Express API Layer
  │
  ├── EVM Router ──► Etherscan / Alchemy
  │
  ├── TRON Router ─► TronScan
  │
  └── BTC Router ──► BlockCypher
  │
  ▼
Transaction Normalization
  │
  ▼
Google Gemini 2.5 Flash
  │
  ▼
AI Summary + Investigation Context
```

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| 3D / Visualization | Three.js, React Three Fiber |
| Data Fetching | TanStack Query |
| Backend | Node.js, Express |
| Blockchain | Etherscan V2, Alchemy RPC, TronScan, BlockCypher |
| AI | Google Gemini 2.5 Flash |
| Security | HTTPS, API-key based service authentication |

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ashu010a/Coin_Tracker.git
cd Coin_Tracker
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd api2
npm install

cd ../api
npm install

cd ..
```

> Use the directory names that exist in your current repository. If your backend folders differ, update the commands accordingly.

## 🔐 Environment Configuration

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here

ETHERSCAN_API_KEY=your_etherscan_api_key_here

TRON_API_KEY=your_tron_api_key_here
```

### API Keys

**Google Gemini**

Used for AI-generated transaction summaries and chat.

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**EVM Chains**

Used for Etherscan-based blockchain data retrieval.

```env
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**TRON**

Used for TRON/TRC20 data where an API key is required by the selected provider.

```env
TRON_API_KEY=your_tron_api_key_here
```

> ⚠️ **Never commit `.env` or expose API keys publicly.** Add `.env` to `.gitignore`.

Example:

```gitignore
.env
.env.*
!.env.example
```

## ▶️ Run the Project

Start the backend services using the commands/configuration defined in the repository, then start the frontend:

```bash
npm run dev
```

Open the local URL shown in your terminal.

## 🔮 Future Roadmap

- Visual wallet/fund-flow graphs
- Automated watchlists
- Algorithmic risk scoring
- Multi-wallet correlation
- Automated cross-chain tracing
- Enterprise APIs

## 🔗 Links

**GitHub:**  
https://github.com/ashu010a/Coin_Tracker

**Live Demo:**  
https://cointracker-8hvg.onrender.com/

## 👥 Team

**Cyber Alpha Army**

### Built for the Hackathon 🚀

Track. Analyze. Trace.
