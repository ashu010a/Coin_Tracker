import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CryptoMarquee from "@/components/CryptoMarquee";
import WalletAnalyzer from "@/components/WalletAnalyzer";
import Features from "@/components/Features";
import CryptoSelector from "@/components/CryptoSelector";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <CryptoMarquee />
        <WalletAnalyzer />
        <Features />
        <CryptoSelector />
      </main>
      <Footer />
    </>
  );
};

export default Index;
