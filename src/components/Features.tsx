import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, TrendingUp, Globe, Lock, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your wallet data is analyzed client-side. We never store your private information.",
  },
  {
    icon: Zap,
    title: "Real-Time Analysis",
    description: "Instant transaction tracking and portfolio updates across all major blockchains.",
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description: "Comprehensive insights with detailed charts, trends, and predictive analytics.",
  },
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Track transactions across Bitcoin, Ethereum, Solana, and 100+ other chains.",
  },
  {
    icon: Lock,
    title: "Bank-Level Security",
    description: "Enterprise-grade encryption and security protocols protect your data.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Tracking",
    description: "Monitor your entire crypto portfolio with real-time valuations and performance metrics.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful <span className="text-gradient">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to track, analyze, and understand your cryptocurrency transactions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="card-glass hover:glow transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
