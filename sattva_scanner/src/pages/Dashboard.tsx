import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Leaf, 
  Shield, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Award,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const mockScannedProducts = [
    {
      id: "SATTVA_TUR_001234",
      name: "Organic Turmeric Root",
      batchId: "TUR-2024-001234",
      scanDate: "2024-03-15",
      verified: true,
      location: "Wayanad, Kerala",
      sustainabilityScore: 95,
    },
    {
      id: "SATTVA_ASH_005678",
      name: "Ashwagandha Powder",
      batchId: "ASH-2024-005678",
      scanDate: "2024-03-10",
      verified: true,
      location: "Rajasthan, India",
      sustainabilityScore: 88,
    },
    {
      id: "SATTVA_TUL_009012",
      name: "Holy Basil (Tulsi)",
      batchId: "TUL-2024-009012",
      scanDate: "2024-03-08",
      verified: true,
      location: "Tamil Nadu, India",
      sustainabilityScore: 92,
    },
  ];

  const stats = {
    totalScans: 12,
    verifiedProducts: 12,
    sustainabilityAverage: 92,
    favoriteRegion: "Kerala, India",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Your Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your scanned herbs and sustainability metrics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalScans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-earth rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified Products</p>
                <p className="text-2xl font-bold text-foreground">{stats.verifiedProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-sage rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Sustainability</p>
                <p className="text-2xl font-bold text-foreground">{stats.sustainabilityAverage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Region</p>
                <p className="text-lg font-bold text-foreground">{stats.favoriteRegion}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card className="shadow-soft mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-primary" />
            <span>Recent Scanned Products</span>
          </CardTitle>
          <CardDescription>
            Your recently verified Ayurvedic herbs and their blockchain provenance
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {mockScannedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:shadow-soft transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">{product.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{product.scanDate}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{product.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right space-y-1">
                    <Badge variant={product.verified ? "default" : "destructive"}>
                      {product.verified ? "Verified" : "Unverified"}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={product.sustainabilityScore} 
                        className="w-16 h-2" 
                      />
                      <span className="text-sm font-medium text-muted-foreground">
                        {product.sustainabilityScore}%
                      </span>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link to={`/product/${product.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button asChild variant="hero">
              <Link to="/scanner">
                <QrCode className="w-4 h-4 mr-2" />
                Scan New Product
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sustainability Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Sustainability Trends</span>
            </CardTitle>
            <CardDescription>Your herb choices impact</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Water Conservation</span>
              <span className="font-semibold text-foreground">2,450L saved</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Carbon Footprint</span>
              <span className="font-semibold text-foreground">-85% reduction</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Fair Trade Impact</span>
              <span className="font-semibold text-foreground">12 farmers supported</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Achievements</span>
            </CardTitle>
            <CardDescription>Your sustainability milestones</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gold/10 rounded-lg border border-gold/20">
              <Award className="w-5 h-5 text-gold" />
              <span className="font-medium text-foreground">Eco Warrior</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Authenticity Guardian</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-sage/20 rounded-lg border border-sage/30">
              <Leaf className="w-5 h-5 text-forest-deep" />
              <span className="font-medium text-foreground">Organic Champion</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;