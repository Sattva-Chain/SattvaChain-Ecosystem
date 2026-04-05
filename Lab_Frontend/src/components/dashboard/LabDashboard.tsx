import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, QrCode, FlaskConical, BarChart3, Clock, CheckCircle, AlertTriangle, Thermometer, Droplet, Wind, Inbox, PanelLeftDashed, DockIcon } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";

interface Product {
  productId: string;
  productName: string;
  location: string;
  temperature: string;
  humidity: string;
  soilMoisture: string;
  type: string;
  ipfsHash: string;
  images: string[];
}

interface LabDashboardProps {
  onNavigate: (view: string) => void;
}

// --- Skeleton Component for Loading State ---
const ProductListSkeleton = () => (
  
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
        <div className="h-16 w-16 bg-gray-200 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- Empty State Component ---
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center text-center py-16">
    <Inbox className="h-16 w-16 text-gray-300 mb-4" />
    <h3 className="text-xl font-semibold text-gray-700">No Products Found</h3>
    <p className="text-gray-500 mt-1">There are no products available from IPFS yet.</p>
  </div>
);


export const LabDashboard = ({ onNavigate }: LabDashboardProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true); // <-- Loading state
  const navigate = useNavigate();
  const { account } = useAuth();
  const navi = useNavigate()
  const fetchIPFSData = async () => {
    setIsLoading(true); // <-- Start loading
    try {
      const { data } = await axios.get("https://farmerbackend-dev.onrender.com/api/allproductes");
      const cleanedData: Product[] = Array.isArray(data)
        ? data.map(item => ({
            ...item,
            productName: item.productName || "Unnamed Product",
            location: item.location && !item.location.includes("undefined") ? item.location : "Unknown Location",
            images: Array.isArray(item.images) ? item.images : [],
            temperature: item.temperature || "-",
            humidity: item.humidity || "-",
            soilMoisture: item.soilMoisture || "-",
            ipfsHash: item.ipfsHash || "",
          }))
        : [];
      setProducts(cleanedData);
    } catch (err) {
      console.error("Failed to fetch IPFS data:", err);
      setProducts([]); // Clear products on error
    } finally {
      setIsLoading(false); // <-- Stop loading
    }
  };

  useEffect(() => {
    fetchIPFSData();
  }, []);

  const stats = [
    { label: "Active Tests", value: products.length.toString(), icon: FlaskConical, color: "info" },
    { label: "Total Images", value: products.reduce((acc, p) => acc + (p.images?.length || 0), 0).toString(), icon: CheckCircle, color: "success" },
    { label: "Unique Locations", value: new Set(products.map(p => p.location)).size.toString(), icon: Clock, color: "warning" },
    { label: "Generated  Cetificated", value: products.length.toString(), icon: DockIcon, color: "primary", NV:"AllCertificted" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Laboratory Dashboard</h1>
          <p className="text-gray-500 mt-1">Herbal Research Lab • License: LAB-2024-001</p>
        </div>
        <Button onClick={() => onNavigate("batch")} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
          <Plus className="h-4 w-4" /> New Batch
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} onClick={()=>navi(`/${stat.NV}`)} className="shadow-sm hover:shadow-lg transition-all duration-300 border hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
              <stat.icon
                className={`h-5 w-5 ${stat.color === "success" ? "text-green-500" : stat.color === "warning" ? "text-yellow-500" : stat.color === "info" ? "text-blue-500" : "text-indigo-500"}`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" >{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border">
          <CardHeader>
            <CardTitle>Products Ready for Analysis</CardTitle>
            <CardDescription>Latest product batches fetched from IPFS for quality testing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <ProductListSkeleton />
            ) : products.length > 0 ? (
              products.map(product => (
                <div
                  key={product.productId}
                  className="flex items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-200 group"
                  onClick={() => navigate(`/product/${product.productId}`)}
                >
                  <div className="flex items-center space-x-4">
                    {product.images?.[0] ? (
                      <img
                        src={`https://ipfs.io/ipfs/${product.images[0]}`}
                        alt={`Product ${product.productId}`}
                        className="h-20 w-20 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">No Img</div>
                    )}
                    <div className="flex flex-col">
                      <div className="font-semibold text-lg text-gray-800">{product.productName}</div>
                      <div className="text-sm text-gray-500">ID: {product.productId}</div>
                      <div className="text-xs mt-1 text-gray-600 font-medium">Location: {product.location}</div>
                      
                      <div className="flex flex-wrap gap-2 text-xs mt-2 text-gray-700">
                        <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-full"><Thermometer className="h-3 w-3 text-red-500" /> {product.temperature}°C</div>
                        <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-full"><Droplet className="h-3 w-3 text-blue-500" /> {product.humidity}%</div>
                        <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-full"><Wind className="h-3 w-3 text-green-500" /> {product.soilMoisture}%</div>
                      </div>
                    </div>
                  </div>
                  {product.ipfsHash && (
                    <a
                      href={`https://ipfs.io/ipfs/${product.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // Prevent card navigation
                      className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-100 transition-colors hidden md:block"
                    >
                      {product.ipfsHash.slice(0, 6)}...{product.ipfsHash.slice(-4)}
                    </a>
                  )}
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>

        {/* Side Cards */}
        <div className="space-y-6">
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common laboratory tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate("research")}>
                <FlaskConical className="mr-2 h-4 w-4" /> Enter Research Data
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate("analytics")}>
                <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-l-4 border-l-yellow-500 bg-yellow-50/50">
            <CardHeader className="flex flex-row items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-800">System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-yellow-900 space-y-1">
                <p>• Batch <strong>BTH-001</strong> heavy metal levels require attention.</p>
                <p>• Equipment calibration due in <strong>3 days</strong>.</p>
                <p>• Monthly compliance report due soon.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};