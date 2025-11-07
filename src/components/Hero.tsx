import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Suspense, lazy } from "react";

const Hero3DScene = lazy(() => import("./Hero3DScene"));

const Hero = () => {
  const scrollToAnalyzer = () => {
    document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* 3D Bitcoin Scene */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <Suspense fallback={
          <div className="text-primary text-xl animate-pulse">Loading 3D Experience...</div>
        }>
          <Hero3DScene />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="space-y-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Track Your <span className="text-gradient">Crypto</span>
            <br />
            Transactions
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Advanced blockchain analysis for wallet addresses across multiple cryptocurrencies
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="text-lg px-8 glow"
              onClick={scrollToAnalyzer}
            >
              Start Analyzing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
