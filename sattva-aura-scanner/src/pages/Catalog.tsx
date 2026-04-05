import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Star, Leaf, Award, MapPin, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios"; // Make sure to import axios

// --- Interfaces for fetched data ---
interface VerifiedProduct {
  _id: string;
  ProductName: string;
  batchId: string;
  qrCodeDataUrl: string;
}

// Dummy product data (can be removed later if not needed)
const dummyProducts = [
  {
    id: "PP6449",
    name: "Organic Neem Extract",
    description: "Pure Neem extract with powerful antimicrobial and wellness properties",
    price: 21.99,
    originalPrice: 26.99,
    image: "https://placehold.co/600x400/a3b18a/ffffff?text=Neem",
    rating: 4.9,
    reviews: 156,
    origin: "Maharashtra, India",
    category: "Extract",
    sustainability: "Eco-Certified",
    organic: true,
    inStock: true
  },
];

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [verifiedProducts, setVerifiedProducts] = useState<VerifiedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // --- Fetch Verified Products from Backend ---
  useEffect(() => {
    const fetchVerifiedProducts = async () => {
      try {
        setLoading(true);
        // Corrected the endpoint based on your backend controller
        const response = await axios.get("https://bkdoflab.onrender.com/getAllOrodcust");
        console.log(response)
        // The data is inside the 'data' property from the API response
        if (response.data && response.data.datas) {
          setVerifiedProducts(response.data.datas);
        }
      } catch (error) {
        console.error("Failed to fetch verified products:", error);
        toast({
          title: "Error",
          description: "Could not fetch verified products from the server.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedProducts();
  }, [toast]);


  const categories = ["All", "Powder", "Capsules", "Extract", "Tablets"];

  const filteredProducts = dummyProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Authentic Ayurvedic Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of premium, blockchain-verified Ayurvedic herbs and supplements
          </p>
        </div>

        {/* --- START: New Verified Products Section --- */}
        <div className="my-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
                    <QrCode className="w-8 h-8 text-green-600" />
                    Blockchain Verified Products
                </h2>
                <p className="text-md text-muted-foreground mt-2">Scan the QR code to view the complete traceability report.</p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">Loading Verified Products...</p>
                </div>
            ) : verifiedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No verified products found.</p>
                </div>
            )}
        </div>
        {/* --- END: New Verified Products Section --- */}

        <hr className="my-12" />

        {/* Existing Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Existing Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-elegant transition-all duration-300 border-none shadow-soft overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.organic && (
                      <Badge className="bg-green-100 text-green-800">
                        <Leaf className="w-3 h-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Award className="w-3 h-3 mr-1" />
                      {product.sustainability}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <Badge variant="outline" className="text-xs mb-2">{product.category}</Badge>
                
                <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-2 mb-3 text-sm">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-muted-foreground">{product.origin}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">₹{(product.price * 83).toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{(product.originalPrice * 83).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/products/${product.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
