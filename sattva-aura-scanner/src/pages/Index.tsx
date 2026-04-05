import HeroSection from "@/components/HeroSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Shield, Leaf, Users, ArrowRight, CheckCircle, Globe, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* About Sattva Chain Section */}
      <section className="py-16 bg-gradient-sage">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose Sattva Chain?
            </h2>
            <p className="text-lg text-muted-foreground">
              We're revolutionizing the Ayurvedic herb industry with blockchain technology, 
              ensuring every product you consume is authentic, sustainable, and ethically sourced.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-soft border-none bg-background/80 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Blockchain Verified</h3>
                <p className="text-muted-foreground text-sm">
                  Immutable records ensure complete transparency and authenticity
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-none bg-background/80 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-earth rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">100% Organic</h3>
                <p className="text-muted-foreground text-sm">
                  Certified organic farming with zero chemical pesticides
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-none bg-background/80 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Fair Trade</h3>
                <p className="text-muted-foreground text-sm">
                  Supporting farmers with fair wages and sustainable practices
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-none bg-background/80 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Global Reach</h3>
                <p className="text-muted-foreground text-sm">
                  Connecting authentic Ayurvedic herbs to consumers worldwide
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How Sattva Chain Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Our simple 3-step process ensures you get authentic, traceable Ayurvedic herbs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-3">1. Scan QR Code</h3>
              <p className="text-muted-foreground">
                Simply scan the QR code on your herb package using our mobile-friendly scanner
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-earth rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-foreground" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-3">2. View Blockchain Record</h3>
              <p className="text-muted-foreground">
                Access complete provenance data including farm details, lab results, and certifications
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-sage rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-foreground" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-3">3. Verify Authenticity</h3>
              <p className="text-muted-foreground">
                Get instant verification of quality, sustainability, and ethical sourcing
              </p>
            </div>
          </div>

          <div className="text-center mt-12 space-x-4">
            <Button asChild variant="hero" size="lg">
              <Link to="/catalog">
                Shop Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/scanner">
                Scan QR Code
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-xl">Sattva Chain</span>
              </div>
              <p className="text-primary-foreground/80">
                Revolutionizing Ayurvedic herb traceability with blockchain technology for authentic, sustainable, and ethical sourcing.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/catalog" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Products
                </Link>
                <Link to="/cart" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Cart
                </Link>
                <Link to="/scanner" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  QR Scanner
                </Link>
                <Link to="/dashboard" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Dashboard
                </Link>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gold text-foreground rounded-full text-sm font-medium">
                  <Award className="w-3 h-3 inline mr-1" />
                  Organic Certified
                </span>
                <span className="px-3 py-1 bg-primary-foreground/20 text-primary-foreground rounded-full text-sm font-medium">
                  FHIR Compliant
                </span>
                <span className="px-3 py-1 bg-primary-foreground/20 text-primary-foreground rounded-full text-sm font-medium">
                  Fair Trade
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
            <p className="text-primary-foreground/60">
              © 2024 Sattva Chain. All rights reserved. Powered by blockchain technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
