import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Camera, CheckCircle, AlertCircle, MapPin, Calendar, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import qrScanIcon from "@/assets/qr-scan-icon.jpg";

interface ScanResult {
  id: string;
  herbName: string;
  batchId: string;
  farmLocation: string;
  harvestDate: string;
  verified: boolean;
  certifications: string[];
  farmer: string;
  sustainabilityScore: number;
}

const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        id: "SATTVA_TUR_001234",
        herbName: "Organic Turmeric Root",
        batchId: "TUR-2024-001234",
        farmLocation: "Wayanad, Kerala, India",
        harvestDate: "2024-02-15",
        verified: true,
        certifications: ["Organic", "Fair Trade", "FHIR Compliant"],
        farmer: "Rajesh Kumar",
        sustainabilityScore: 95,
      });
    }, 3000);
  };

  const handleRetry = () => {
    setScanResult(null);
    setIsScanning(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            QR Code Scanner
          </h1>
          <p className="text-lg text-muted-foreground">
            Scan the QR code on your herb package to verify authenticity and view blockchain provenance
          </p>
        </div>

        {!scanResult ? (
          <Card className="shadow-soft">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <QrCode className="w-6 h-6 text-primary" />
                <span>Scan QR Code</span>
              </CardTitle>
              <CardDescription>
                Point your camera at the QR code on your Ayurvedic herb package
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Scanner Area */}
              <div className="relative">
                <div className="aspect-square bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                  {isScanning ? (
                    <div className="text-center space-y-4">
                      <div className="animate-pulse">
                        <Camera className="w-16 h-16 text-primary mx-auto mb-4" />
                      </div>
                      <div className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-muted-foreground font-medium">Scanning QR Code...</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <img 
                        src={qrScanIcon} 
                        alt="QR Scanner" 
                        className="w-24 h-24 mx-auto opacity-60"
                      />
                      <p className="text-muted-foreground">Camera will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Scan Button */}
              <Button
                onClick={handleScan}
                disabled={isScanning}
                variant="scan"
                size="lg"
                className="w-full"
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    Start Scanning
                  </>
                )}
              </Button>

              {/* Instructions */}
              <div className="text-center space-y-2 text-sm text-muted-foreground">
                <p>• Ensure good lighting and steady camera</p>
                <p>• Hold QR code within the scanning area</p>
                <p>• Wait for automatic detection</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Scan Results */
          <div className="space-y-6 animate-fade-in">
            {/* Verification Status */}
            <Card className={`shadow-soft border-2 ${scanResult.verified ? 'border-green-500' : 'border-red-500'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  {scanResult.verified ? (
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  ) : (
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  )}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground">
                      {scanResult.verified ? 'Verified Authentic' : 'Verification Failed'}
                    </h2>
                    <p className="text-muted-foreground">
                      {scanResult.verified ? 'This herb is genuine and traceable' : 'Could not verify authenticity'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{scanResult.herbName}</CardTitle>
                <CardDescription>Batch ID: {scanResult.batchId}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Farm Location</h4>
                      <p className="text-muted-foreground">{scanResult.farmLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Harvest Date</h4>
                      <p className="text-muted-foreground">{scanResult.harvestDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Farmer</h4>
                      <p className="text-muted-foreground">{scanResult.farmer}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Sustainability Score</h4>
                      <p className="text-muted-foreground">{scanResult.sustainabilityScore}%</p>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {scanResult.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gold text-foreground rounded-full text-sm font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="hero" size="lg" className="flex-1">
                <Link to={`/product/${scanResult.id}`}>
                  View Full Provenance
                </Link>
              </Button>
              <Button onClick={handleRetry} variant="outline" size="lg">
                Scan Another QR Code
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;