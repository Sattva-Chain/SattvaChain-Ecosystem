import { Button } from "@/components/ui/button";
import { QrCode, Shield, Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-herbs.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Authentic
              <span className="block text-transparent bg-gradient-primary bg-clip-text">
                Ayurvedic Herbs
              </span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground mt-2">
                Verified by Blockchain
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Trace your herbs from seed to shelf. Scan QR codes to verify authenticity, 
            sustainability, and ethical sourcing with blockchain technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
              <Link to="/scanner" className="flex items-center space-x-2">
                <QrCode className="w-5 h-5" />
                <span>Scan QR Code</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="earth" size="lg" className="w-full sm:w-auto">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Leaf className="w-5 h-5" />
                <span>View Dashboard</span>
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Blockchain Verified</h3>
              <p className="text-muted-foreground text-center">Every herb tracked with immutable blockchain records</p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="w-12 h-12 bg-gradient-earth rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">100% Organic</h3>
              <p className="text-muted-foreground text-center">Certified organic farming with sustainable practices</p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center">
                <QrCode className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Easy Verification</h3>
              <p className="text-muted-foreground text-center">Simple QR code scanning for instant authenticity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-10 w-8 h-8 bg-gold/20 rounded-full animate-float hidden lg:block" />
      <div className="absolute bottom-32 right-16 w-6 h-6 bg-primary/20 rounded-full animate-float hidden lg:block" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-20 w-4 h-4 bg-sage/30 rounded-full animate-pulse-slow hidden lg:block" />
    </section>
  );
};

export default HeroSection;