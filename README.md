Coin_Tracker (Crypto-Trace) 🔎⛓️
A real-time, multi-chain cryptocurrency monitoring and investigation platform. Coin_Tracker allows users to seamlessly track wallet activities across 8 different blockchains, view live balances, and leverage Google Gemini AI to analyze transaction patterns for suspicious activities.

🚀 Features
Multi-Chain Support: Unified monitoring for Ethereum, Polygon, Arbitrum, Base, Avalanche, Solana, TRON (TRC-20), and Bitcoin.
AI-Powered Investigator: Integrates Google's Gemini 2.5 Flash to automatically summarize wallet behavior and flag suspicious patterns (e.g., wash trading, high-frequency transactions).
Interactive AI Chat: Ask natural language questions about a wallet's transaction history directly in the dashboard.
Real-Time Data: Fetches live balances and recent transaction histories using direct RPCs and block explorer APIs.
Immersive UI: A modern, dark-themed interface built with Tailwind CSS, Shadcn UI, and interactive 3D elements (Three.js/React Three Fiber).
Concurrent Architecture: Runs a unified frontend alongside specialized microservices for EVM and Non-EVM networks.
🛠 Tech Stack
Frontend
Framework: React 18 with TypeScript
Build Tool: Vite
Styling: Tailwind CSS + shadcn/ui (Radix UI)
3D Graphics: Three.js & React Three Fiber (@react-three/fiber, @react-three/drei)
State/Fetching: TanStack React Query & React Router v6
Animations: Framer Motion
Backend & APIs
Runtime: Node.js + Express
AI Engine: Google Generative AI (Gemini SDK)
Blockchain APIs:
Etherscan V2 API (EVM Chains)
TronScan API (TRON)
Alchemy RPC (Solana)
BlockCypher / Blockchain.info (Bitcoin)
Process Management: concurrently (runs Frontend, EVM API, and TRON API simultaneously)
🏗 Architecture / How It Works
User Input: The user pastes a wallet address and selects a network via the React frontend.
API Routing: The frontend routes the request to the appropriate Express microservice:
/api-evm/ routes to the EVM Node server handling Ethereum, Base, Polygon, Arbitrum, etc.
/api/ routes to the TRON/BTC Node server handling non-EVM logic.
Data Aggregation: The backend fetches the raw balance and transaction arrays from respective block explorers.
AI Processing: The aggregated transaction JSON is sent to the Gemini AI model with a system prompt to detect anomalies and summarize financial behavior.
UI Rendering: The frontend displays the balance, a parsed transaction table, the AI summary, and an active chat window to interrogate the data further.
⚙️ Prerequisites
Node.js (v16 or higher)
npm or yarn
API Keys for Gemini, Etherscan, and optionally TRON/Alchemy.
🚀 Local Installation & Setup
Clone the repository

bash

git clone https://github.com/ashu010a/Coin_Tracker.git
cd Coin_Tracker
Install dependencies

bash

npm install
Also ensure dependencies in the backend directories are installed:

bash

cd api2 && npm install && cd ..
Environment Configuration Create a .env file in the root directory and add the following keys:

env

# Google Gemini (required for AI summary/chat)
GEMINI_API_KEY=your_gemini_api_key_here
# EVM chains (ethereum/base/polygon/arbitrum/avalanche)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
# TRON (if your provider requires a key for TRC20 endpoints)
TRON_API_KEY=your_tron_api_key_here
# Solana RPC (Alchemy/Helius/other)
SOLANA_RPC_URL=your_solana_rpc_url_here
# Ports (Optional overrides)
PORT=3000
PORT_TRON=4000
Run the Application The project is configured to run the frontend and both backend API servers concurrently.

bash

npm run dev
This command starts:

React Frontend on http://localhost:5173
TRON/BTC API on http://localhost:4000
EVM API on http://localhost:3000
📁 Project Structure
text

Coin_Tracker/
├── api/                  # Legacy/Helper API scripts
├── api2/                 # Main Express Backend
│   ├── api.js            # TRON & Bitcoin routes + Gemini AI
│   └── apii.js           # EVM routes + Gemini AI
├── src/                  # React Frontend
│   ├── components/       # UI Components (WalletAnalyzer, Bitcoin3D, etc.)
│   ├── components/ui/    # Shadcn UI reusable components
│   ├── pages/            # Page Views (Index, NotFound)
│   ├── App.tsx           # Main App Routing
│   └── main.tsx          # React Entry Point
├── .env                  # Environment Variables
├── package.json          # Root dependencies & Concurrent scripts
├── render.yaml           # Deployment configuration for Render
├── tailwind.config.ts    # Tailwind CSS configuration
└── vite.config.js        # Vite configuration & proxy settings
📄 License
This project is open-source and available under the MIT License.
