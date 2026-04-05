import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { QrCode, ArrowLeft, Thermometer, Droplet, Clock, Sun, Wind, TestTube, Microscope, Leaf, Award, Hash, UserSquare, Calendar, MapPin } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
// --- Product Details Page Component ---
// This component now fetches from your new endpoint and displays all product data.
const ProductDetailsPage = ({ onBack }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const {productId}  = useParams()
    useEffect(() => {
      console.log(productId)
        if (!productId) return;
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                // The productId from the URL is the batchId, matching the backend route.
                const response = await axios.get(`https://bkdoflab.onrender.com/products/${productId}`);
                // Adjusted to parse the 'datas' object from your backend response.
                if (response.data && response.data.datas) {
                    setProduct(response.data.datas);
                } else {
                    toast({ title: "Not Found", description: "This product could not be found.", variant: "destructive" });
                    setProduct(null); // Ensure product is cleared on error
                }
            } catch (error) {
                console.error(`Failed to fetch product details for ${productId}:`, error);
                toast({
                    title: "Error",
                    description: "Could not fetch product details from the server.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId, toast]);

    if (loading) {
        return <div className="text-center py-20">Loading product details...</div>;
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="mb-4 text-lg">Product not found.</p>
                <Button onClick={onBack} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Catalog
                </Button>
            </div>
        );
    }
    
    // Helper to render detail items consistently
    const DetailItem = ({ icon, label, value, unit = '' }) => (
        <div className="flex items-start p-3 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100">
            <div className="mr-4 text-green-700">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-semibold text-gray-900">{String(value)} {unit}</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-lg">
            <Button onClick={onBack} variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Catalog
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: QR Code and Main Info */}
                <div className="lg:col-span-1">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-center text-gray-800">{product.ProductName}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="p-2 bg-white border-4 border-gray-100 rounded-lg">
                                <img src={product.qrCodeDataUrl} alt={`QR Code for ${product.ProductName}`} className="w-full h-auto" />
                            </div>
                            <p className="text-sm text-center text-gray-500">Scan for full traceability report</p>
                            <a 
                                href={`https://gateway.pinata.cloud/ipfs/${product.certificateIpfsHash}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full"
                            >
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">View IPFS Certificate</Button>
                            </a>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: All Remaining Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Key Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem icon={<Hash size={24} />} label="Batch ID" value={product.batchId} />
                            <DetailItem icon={<UserSquare size={24} />} label="Farmer ID" value={product.farmerId} />
                            <DetailItem icon={<Award size={24} />} label="Lab License" value={product.licenseId} />
                            <DetailItem icon={<Calendar size={24} />} label="Test Date" value={new Date(product.testDate).toLocaleDateString()} />
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Farmer & Origin</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem icon={<UserSquare size={24} />} label="Farmer Name" value="Rajesh Kumar" />
                            <DetailItem icon={<MapPin size={24} />} label="Location" value="Wayanad, Kerala, India" />
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Environmental & Storage</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <DetailItem icon={<Thermometer size={24} />} label="Temperature" value={product.temperature} unit="°C" />
                            <DetailItem icon={<Droplet size={24} />} label="Humidity" value={product.humidity} unit="%" />
                            <DetailItem icon={<Clock size={24} />} label="Storage Time" value={product.storageTime} unit="days" />
                            <DetailItem icon={<Sun size={24} />} label="Light Exposure" value={product.lightExposure} unit="hrs/day" />
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Soil Analysis</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                             <DetailItem icon={<Wind size={24} />} label="Soil pH" value={product.soilPh} />
                            <DetailItem icon={<Droplet size={24} />} label="Soil Moisture" value={product.soilMoisture} unit="%" />
                            <DetailItem icon={<TestTube size={24} />} label="Soil Nitrogen" value={product.soilNitrogen} unit="mg/kg" />
                            <DetailItem icon={<TestTube size={24} />} label="Soil Phosphorus" value={product.soilPhosphorus} unit="mg/kg" />
                            <DetailItem icon={<TestTube size={24} />} label="Soil Potassium" value={product.soilPotassium} unit="mg/kg" />
                            <DetailItem icon={<Leaf size={24} />} label="Soil Carbon" value={product.soilCarbon} unit="%" />
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Quality & Safety Analysis</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <DetailItem icon={<TestTube size={24} />} label="Essential Oil" value={product.essentialOil} unit="%" />
                            <DetailItem icon={<Microscope size={24} />} label="Bacterial Count" value={product.bacterialCount} unit="CFU/g" />
                            <DetailItem icon={<Microscope size={24} />} label="Fungal Count" value={product.fungalCount} unit="CFU/g" />
                            <DetailItem icon={<TestTube size={24} />} label="Pesticide Residue" value={product.pesticideResidue} unit="ppm" />
                            <DetailItem icon={<TestTube size={24} />} label="Lead (Pb)" value={product.heavyMetalPb} unit="ppm" />
                            <DetailItem icon={<Award size={24} />} label="DNA Authenticity" value={product.dnaAuthenticity} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};


// --- Catalog Page Component ---
const CatalogPage = () => {
    const [verifiedProducts, setVerifiedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchVerifiedProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get("https://bkdoflab.onrender.com/getAllOrodcust");
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
    
    return (
        <div className="min-h-screen py-8 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Authentic Ayurvedic Products
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover our collection of premium, blockchain-verified Ayurvedic herbs and supplements
                    </p>
                </div>

                <div className="my-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
                            <QrCode className="w-8 h-8 text-green-600" />
                            Blockchain Verified Products
                        </h2>
                        <p className="text-md text-muted-foreground mt-2">Scan the QR code or click details to view the complete traceability report.</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">Loading Verified Products...</p>
                        </div>
                    ) : verifiedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {verifiedProducts.map((product) => (
                                <Card key={product._id} className="group hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                    <CardHeader className="p-0">
                                      <img 
                                        src={`https://placehold.co/600x400/228B22/ffffff?text=${encodeURIComponent(product.ProductName)}`} 
                                        alt={product.ProductName}
                                        className="w-full h-40 object-cover rounded-t-lg"
                                      />
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center p-4 flex-grow">
                                        <CardTitle className="text-center text-lg mb-4 h-14 flex items-center">{product.ProductName}</CardTitle>
                                        <div className="p-2 border rounded-lg bg-white mt-auto">
                                            <img
                                                src={product.qrCodeDataUrl}
                                                alt={`QR Code for ${product.ProductName}`}
                                                className="w-32 h-32 object-contain"
                                            />
                                        </div>
                                        <a href={`#/products/${product.batchId}`} className="w-full mt-4">
                                            <Button variant="outline" size="sm" className="w-full">
                                                View Details
                                            </Button>
                                        </a>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">No verified products found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main App Component with Routing ---
const Catalog = () => {
    const [route, setRoute] = useState({ view: 'catalog', productId: null });

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            const parts = hash.split('/');

            if (parts[1] === 'products' && parts[2]) {
                setRoute({ view: 'details', productId: parts[2] });
            } else {
                setRoute({ view: 'catalog', productId: null });
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Check initial hash on load

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigateToCatalog = () => {
      window.location.hash = '#/';
    };

    if (route.view === 'details') {
        return <ProductDetailsPage productId={route.productId} onBack={navigateToCatalog} />;
    }

    return <CatalogPage />;
};

export default Catalog;

