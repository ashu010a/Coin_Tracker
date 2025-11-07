import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import bitcoinLogo from "@/assets/logos/bitcoin.png";
import ethereumLogo from "@/assets/logos/ethereum.png";
import tetherLogo from "@/assets/logos/tether.png";
import bnbLogo from "@/assets/logos/bnb.png";
import solanaLogo from "@/assets/logos/solana.png";
import cardanoLogo from "@/assets/logos/cardano.png";
import rippleLogo from "@/assets/logos/ripple.png";
import polkadotLogo from "@/assets/logos/polkadot.png";
import { CheckCircle2 } from "lucide-react";

const cryptocurrencies = [
  { 
    name: "Bitcoin", 
    symbol: "BTC", 
    logo: bitcoinLogo,
    price: "$67,432.12",
    change: "+5.23%",
    description: "The original cryptocurrency and digital gold standard"
  },
  { 
    name: "Ethereum", 
    symbol: "ETH", 
    logo: ethereumLogo,
    price: "$3,245.67",
    change: "+3.45%",
    description: "Smart contract platform powering DeFi and NFTs"
  },
  { 
    name: "Tether", 
    symbol: "USDT", 
    logo: tetherLogo,
    price: "$1.00",
    change: "+0.01%",
    description: "Leading stablecoin pegged to US Dollar"
  },
  { 
    name: "BNB", 
    symbol: "BNB", 
    logo: bnbLogo,
    price: "$612.34",
    change: "+2.78%",
    description: "Binance ecosystem token for trading and DeFi"
  },
  { 
    name: "Solana", 
    symbol: "SOL", 
    logo: solanaLogo,
    price: "$156.89",
    change: "+7.12%",
    description: "High-performance blockchain for Web3 applications"
  },
  { 
    name: "Cardano", 
    symbol: "ADA", 
    logo: cardanoLogo,
    price: "$0.67",
    change: "+4.23%",
    description: "Research-driven blockchain with proof-of-stake"
  },
  { 
    name: "Ripple", 
    symbol: "XRP", 
    logo: rippleLogo,
    price: "$0.52",
    change: "+1.89%",
    description: "Global payment network for financial institutions"
  },
  { 
    name: "Polkadot", 
    symbol: "DOT", 
    logo: polkadotLogo,
    price: "$8.45",
    change: "+6.34%",
    description: "Multi-chain network connecting blockchains"
  },
];

const CryptoSelector = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);

  return (
    <section id="cryptocurrencies" className="py-20 px-6 bg-card/10">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Select a <span className="text-gradient">Cryptocurrency</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from the top cryptocurrencies to analyze transactions and market data
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cryptocurrencies.map((crypto) => (
            <Card
              key={crypto.symbol}
              className={`card-glass cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedCrypto === crypto.symbol ? "ring-2 ring-primary glow" : ""
              }`}
              onClick={() => setSelectedCrypto(crypto.symbol)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={crypto.logo}
                      alt={`${crypto.name} logo`}
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <CardTitle className="text-lg">{crypto.name}</CardTitle>
                      <CardDescription>{crypto.symbol}</CardDescription>
                    </div>
                  </div>
                  {selectedCrypto === crypto.symbol && (
                    <CheckCircle2 className="h-6 w-6 text-primary animate-in zoom-in" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{crypto.price}</span>
                  <Badge 
                    variant="outline" 
                    className={crypto.change.startsWith("+") ? "border-primary text-primary" : "border-destructive text-destructive"}
                  >
                    {crypto.change}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {crypto.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCrypto && (
          <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom duration-500">
            <Card className="card-glass max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Analyzing {cryptocurrencies.find(c => c.symbol === selectedCrypto)?.name}
                </CardTitle>
                <CardDescription>
                  View detailed transaction analytics and market insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Transaction analysis for {selectedCrypto} is now active. Enter a wallet address above to view specific transaction data.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default CryptoSelector;
