import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Wallet,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WalletAnalyzer = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const networks = [
    { value: "ethereum", label: "Ethereum", apiUrl: "/api/ethereum" },
    { value: "base", label: "Base", apiUrl: "/api/base" },
    { value: "polygon", label: "Polygon", apiUrl: "/api/polygon" },
    { value: "arbitrum", label: "Arbitrum", apiUrl: "/api/arbitrum" },
    { value: "avalanche", label: "Avalanche", apiUrl: "/api/avalanche" },
    { value: "solana", label: "Solana", apiUrl: "/api/sol" },
    { value: "usdt", label: "USDT (TRC20)", apiUrl: "/api/tr20" },
    { value: "btc", label: "Bitcoin", apiUrl: "/api/btc" },
  ];

  const handleAnalyze = async () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Wallet Address Required",
        description: "Please enter a wallet address to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedNetwork) {
      toast({
        title: "Network Required",
        description: "Please select a blockchain network.",
        variant: "destructive",
      });
      return;
    }

    const network = networks.find((n) => n.value === selectedNetwork);
    if (!network) {
      toast({
        title: "Invalid Network",
        description: "Please select a valid blockchain network.",
        variant: "destructive",
      });
      return;
    }

    const apiUrl = `${network.apiUrl}/${walletAddress}`;
    setIsAnalyzing(true);

    try {
      console.log("Fetching from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data || !Array.isArray(data.transactions)) {
        throw new Error("Invalid API response format. Missing transactions array.");
      }

      const processedData = {
        balance: data.balance || 0,
        transactions: data.transactions.map((tx) => ({
          type: tx.from?.toLowerCase() === walletAddress.toLowerCase() ? "Send" : "Receive",
          amount:
            tx.from?.toLowerCase() === walletAddress.toLowerCase()
              ? `-${tx.value} ${network.label.includes("BTC") ? "BTC" : network.label.includes("Solana") ? "SOL" : "ETH"}`
              : `+${tx.value} ${network.label.includes("BTC") ? "BTC" : network.label.includes("Solana") ? "SOL" : "ETH"}`,
          usd: `$${(tx.value * 2500).toFixed(2)}`,
          time: new Date(tx.time).toLocaleString(),
          hash: tx.hash || "N/A",
          from: tx.from || "N/A",
          to: tx.to || "N/A",
        })),
        lastActivity:
          data.transactions.length > 0
            ? new Date(data.transactions[0].time).toLocaleString()
            : "N/A",
      };

      setTransactionData(processedData);
      setShowResults(true);

      // Fetch AI summary
      try {
        const aiRes = await fetch("/api-ai/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chain: network.value,
            address: walletAddress,
            balance: processedData.balance,
            transactions: processedData.transactions,
          }),
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          setAiSummary(aiData.summary || "");
        }
      } catch (e) {
        // ignore summary errors for UX
      }

      toast({
        title: "Analysis Complete",
        description: `Transaction data loaded for ${network.label}`,
      });
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "Analysis Failed",
        description: `Failed to fetch transaction data: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="analyzer" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Analyze Any <span className="text-gradient">Wallet</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter a wallet address to view transaction history, balance, and detailed analytics.
          </p>
        </div>

        {/* Wallet Input */}
        <Card className="card-glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Wallet Address
            </CardTitle>
            <CardDescription>
              Enter the blockchain wallet address you want to analyze.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
                <Select
                  value={selectedNetwork}
                  onValueChange={setSelectedNetwork}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Network" />
                  </SelectTrigger>
                  <SelectContent>
                    {networks.map((network) => (
                      <SelectItem key={network.value} value={network.value}>
                        {network.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="glow flex-1"
                >
                  {isAnalyzing ? (
                    <>Analyzing...</>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  disabled={!showResults}
                  onClick={() => {
                    if (chatRef.current) {
                      chatRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                >
                  Chat with AI
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {showResults && transactionData && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {/* Balance */}
            <Card className="card-glass hover:glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Total Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  ${transactionData.balance?.toFixed(2) || "0.00"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Across all assets</p>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card className="card-glass hover:glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {transactionData.transactions?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Lifetime activity</p>
              </CardContent>
            </Card>

            {/* Last Activity */}
            <Card className="card-glass hover:glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  Last Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {transactionData.lastActivity || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Most recent transaction
                </p>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="card-glass md:col-span-2 lg:col-span-3" ref={chatRef}>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest blockchain activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionData.transactions.length > 0 ? (
                    transactionData.transactions.slice(0, 10).map((tx, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                tx.type === "Receive" ? "bg-primary" : "bg-accent"
                              } animate-pulse`}
                            ></div>
                            <div>
                              <p className="font-semibold">{tx.type}</p>
                              <p className="text-sm text-muted-foreground">{tx.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold ${
                                tx.type === "Receive" ? "text-primary" : "text-accent"
                              }`}
                            >
                              {tx.amount}
                            </p>
                            <p className="text-sm text-muted-foreground">{tx.usd}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">From:</span>
                            <p className="font-mono break-all">{tx.from}</p>
                          </div>
                          <div>
                            <span className="font-medium">To:</span>
                            <p className="font-mono break-all">{tx.to}</p>
                          </div>
                        </div>
                        {tx.hash && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium">Hash:</span>
                            <p className="font-mono break-all">{tx.hash}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No transactions found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Summary */}
            <Card className="card-glass md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>Summary generated by Gemini 2.5 Pro</CardDescription>
              </CardHeader>
              <CardContent>
                {aiSummary ? (
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm">
                    {aiSummary}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No AI summary yet.</p>
                )}
              </CardContent>
            </Card>

            {/* AI Chat */}
            <Card className="card-glass md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Ask AI about this wallet</CardTitle>
                <CardDescription>Questions must relate to the loaded data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="max-h-64 overflow-auto space-y-2 p-2 rounded-md bg-secondary/40">
                    {chatMessages.length === 0 && (
                      <p className="text-xs text-muted-foreground">No messages yet.</p>
                    )}
                    {chatMessages.map((m, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{m.role === "user" ? "You" : "AI"}:</span> {m.content}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about transfers, patterns, risks..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={async () => {
                        const question = chatInput.trim();
                        if (!question) return;
                        setChatMessages((prev) => [...prev, { role: "user", content: question }]);
                        setChatInput("");
                        try {
                          const resp = await fetch("/api-ai/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              chain: selectedNetwork,
                              address: walletAddress,
                              balance: transactionData.balance,
                              transactions: transactionData.transactions,
                              question,
                            }),
                          });
                          if (resp.ok) {
                            const data = await resp.json();
                            setChatMessages((prev) => [...prev, { role: "assistant", content: data.answer || "" }]);
                          } else {
                            setChatMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't answer that." }]);
                          }
                        } catch (e) {
                          setChatMessages((prev) => [...prev, { role: "assistant", content: "Network error while contacting AI." }]);
                        }
                      }}
                    >
                      Ask
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default WalletAnalyzer;
