import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "card-glass border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("top")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center glow">
              <Wallet className="h-6 w-6 text-background" />
            </div>
            <span className="text-2xl font-bold text-gradient">CryptoTracker</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("analyzer")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Analyzer
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("cryptocurrencies")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Cryptocurrencies
            </button>
            <Button size="sm" className="glow">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-in slide-in-from-top duration-300">
            <button
              onClick={() => scrollToSection("analyzer")}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              Analyzer
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("cryptocurrencies")}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              Cryptocurrencies
            </button>
            <Button size="sm" className="w-full glow">
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
