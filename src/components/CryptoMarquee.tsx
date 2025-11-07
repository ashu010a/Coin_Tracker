import bitcoinLogo from "@/assets/logos/bitcoin.png";
import ethereumLogo from "@/assets/logos/ethereum.png";
import tetherLogo from "@/assets/logos/tether.png";
import bnbLogo from "@/assets/logos/bnb.png";
import solanaLogo from "@/assets/logos/solana.png";
import cardanoLogo from "@/assets/logos/cardano.png";
import rippleLogo from "@/assets/logos/ripple.png";
import polkadotLogo from "@/assets/logos/polkadot.png";
import dogecoinLogo from "@/assets/logos/dogecoin.png";
import avalancheLogo from "@/assets/logos/avalanche.png";

const cryptos = [
  { name: "Bitcoin", symbol: "BTC", logo: bitcoinLogo },
  { name: "Ethereum", symbol: "ETH", logo: ethereumLogo },
  { name: "Tether", symbol: "USDT", logo: tetherLogo },
  { name: "BNB", symbol: "BNB", logo: bnbLogo },
  { name: "Solana", symbol: "SOL", logo: solanaLogo },
  { name: "Cardano", symbol: "ADA", logo: cardanoLogo },
  { name: "Ripple", symbol: "XRP", logo: rippleLogo },
  { name: "Polkadot", symbol: "DOT", logo: polkadotLogo },
  { name: "Dogecoin", symbol: "DOGE", logo: dogecoinLogo },
  { name: "Avalanche", symbol: "AVAX", logo: avalancheLogo },
];

const CryptoMarquee = () => {
  return (
    <section className="py-16 border-y border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Top 10 Cryptocurrencies</h2>
        <p className="text-muted-foreground">Supported blockchain networks</p>
      </div>
      
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10"></div>
        
        {/* Marquee content - duplicated for seamless loop */}
        <div className="flex animate-marquee">
          {[...cryptos, ...cryptos].map((crypto, index) => (
            <div
              key={`${crypto.symbol}-${index}`}
              className="flex-shrink-0 mx-8 group cursor-pointer"
            >
              <div className="card-glass rounded-2xl p-6 transition-all duration-300 hover:scale-110 hover:glow">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img
                      src={crypto.logo}
                      alt={`${crypto.name} logo`}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">{crypto.name}</p>
                    <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CryptoMarquee;
