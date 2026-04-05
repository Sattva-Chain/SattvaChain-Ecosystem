// src/components/ProductDetails.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowLeft, ChevronDown, Save, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuth } from "@/context/auth";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// ------------------ Interfaces ------------------
interface ProductData {
  farmerId:string
  ProductName:string
  batchId: string;
  testDate: string;
  temperature: number;
  humidity: number;
  storageTime: number;
  lightExposure: number;
  soilPh: number;
  soilMoisture: number;
  soilNitrogen: number;
  soilPhosphorus: number;
  soilPotassium: number;
  soilCarbon: number;
  heavyMetalPb: number;
  heavyMetalAs: number;
  heavyMetalHg: number;
  heavyMetalCd: number;
  aflatoxinTotal: number;
  pesticideResidue: number;
  moistureContent: number;
  essentialOil: number;
  chlorophyllIndex: number;
  leafSpots: number;
  discoloration: number;
  bacterialCount: number;
  fungalCount: number;
  ecoliPresent: string;
  salmonellaPresent: string;
  dnaAuthenticity: string;
}

interface ApiAnomaly {
  parameter: string;
  expected_range: string;
  actual_value: string;
}

interface ApiResponse {
  status: "Normal" | "Anomaly Detected";
  summary: string;
  anomalies: ApiAnomaly[] | null;
  quality_rating?: number;
}

export const ProductDetails = ({
  onNavigate,
}: {
  onNavigate: (view: string) => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const { contract, user } = useAuth();

  const UseNav  = useNavigate();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("Processing...");
  const [modalContent, setModalContent] = useState<ApiResponse | null>(null);
  const [step, setStep] = useState<
    "form" | "ai-running" | "ai-result" | "preview" | "blockchain" | "anomaly"
  >("form");
  const [openSections, setOpenSections] = useState({
    environmental: true,
    contaminants: false,
    biochemical: false,
    microbial: false,
    genetic: false,
  });

  const certificateRef = useRef<HTMLDivElement | null>(null);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  // ------------------ Fetch Product ------------------
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data } = await axios.get(
          "https://farmerbackend-dev.onrender.com/api/allproductes"
        );
        const prod = data.find((p: any) => p.productId === id);
        console.log(prod)
        if (prod) {
          setProduct({
            ProductName:prod.productName,
            farmerId:prod.farmerId,
            batchId: prod.productId,
            testDate: new Date().toISOString().split("T")[0],
            temperature: parseFloat(prod.temperature) || 0,
            humidity: 65,
            storageTime: 100,
            lightExposure: 6,
            soilPh: 6.5,
            soilMoisture: 20,
            soilNitrogen: 400,
            soilPhosphorus: 40,
            soilPotassium: 300,
            soilCarbon: 0.8,
            heavyMetalPb: 0.1,
            heavyMetalAs: 0.05,
            heavyMetalHg: 0.01,
            heavyMetalCd: 0.02,
            aflatoxinTotal: 5,
            pesticideResidue: 0.1,
            moistureContent: 10,
            essentialOil: 1.2,
            chlorophyllIndex: 30,
            leafSpots: 2,
            discoloration: 1,
            bacterialCount: 5000,
            fungalCount: 500,
            ecoliPresent: "no",
            salmonellaPresent: "no",
            dnaAuthenticity: "100%",
          });
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to fetch product data.",
          variant: "destructive",
        });
      }
    };
    fetchProductData();
  }, [id]);

  // ------------------ Handle Input ------------------
  const handleInputChange = (field: keyof ProductData, value: string) => {
    setProduct((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // ------------------ AI Submit Handler ------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);
    setLoaderText("Analyzing data with AI...");
    setStep("ai-running");
    try {
      const submissionData = {
        herb_name: product.batchId,
        Famer_Id: user?.licenseId || "F123",
        test_results: { ...product },
      };
      const { data } = await axios.post(
        "https://sattva-chain-processor.onrender.com/agent/analyze-herb-quality-rag",
        submissionData
      );
      console.log(data)
      setModalContent(data);
      if (data.status === "Normal") {
        setStep("ai-result");
      } else {
        setStep("anomaly");
      }
    } catch (err) {
      console.error("err",err);
      toast({
        title: "AI Analysis Error",
        description: "Please check your connection or inputs.",
        variant: "destructive",
      });
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Download PDF from certificateRef ------------------
  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    try {
      setLoading(true);
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${product?.batchId || "certificate"}_Certificate.pdf`);
      toast({ title: "Downloaded", description: "PDF downloaded." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not generate PDF.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Store Certificate on Pinata and Data on Blockchain ------------------
  const handleStoreOnBlockchain = async () => {
    if (!contract || !product) {
      toast({ title: "Missing", description: "Wallet/contract not connected.", variant: "destructive" });
      return;
    }
    if (!certificateRef.current) {
        toast({ title: "Error", description: "Certificate preview is not available.", variant: "destructive" });
        return;
    }

    setLoading(true);
    setStep("blockchain");
    
    try {
      // Step 1: Capture Certificate and Upload to Pinata
      setLoaderText("Uploading certificate to IPFS...");
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) {
          throw new Error("Failed to create image blob from certificate.");
      }
      const file = new File([blob], `Certificate-${product.batchId}.png`, { type: 'image/png' });
      
      const formData = new FormData();
      formData.append("file", file);

      const metadata = JSON.stringify({
        name: `Certificate-${product.batchId}`,
        keyvalues: {
          licenseId: user?.licenseId || 'NOT_AVAILABLE',
          batchId: product.batchId,
        }
      });
      formData.append('pinataMetadata', metadata);
      
      const pinataResponse = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              pinata_api_key: "9ee892bfc12b953147be",
              pinata_secret_api_key: "c85fc4ba88949c3302c358f04734f9b51b2c971f1de682e0f90304eb6a8a01d3",
            },
          }
      );

      const certificateIpfsHash = pinataResponse.data.IpfsHash;
      toast({ title: "Upload Success", description: "Certificate stored on IPFS." });
      
      // Step 2: Prepare structs and store all data in a SINGLE transaction
      setLoaderText("Preparing data for blockchain...");

      const basicData = {
          herb_name: product.batchId,
          Farmer_Id: user?.licenseId || "F123",
      };

      const environmentData = {
          Temperature_C: Math.round(product.temperature * 100),
          Humidity_Pct: Math.round(product.humidity * 100),
          Storage_Time_Days: product.storageTime,
          Light_Exposure_hours_per_day: Math.round(product.lightExposure * 100),
      };

      const soilData = {
          Soil_pH: Math.round(product.soilPh * 100),
          Soil_Moisture_Pct: Math.round(product.soilMoisture * 100),
          Soil_Nitrogen_mgkg: product.soilNitrogen,
          Soil_Phosphorus_mgkg: product.soilPhosphorus,
          Soil_Potassium_mgkg: product.soilPotassium,
          Soil_Organic_Carbon_Pct: Math.round(product.soilCarbon * 100),
      };

      const contaminantsData = {
          Heavy_Metal_Pb_ppm: Math.round(product.heavyMetalPb * 100),
          Heavy_Metal_As_ppm: Math.round(product.heavyMetalAs * 100),
          Heavy_Metal_Hg_ppm: Math.round(product.heavyMetalHg * 100),
          Heavy_Metal_Cd_ppm: Math.round(product.heavyMetalCd * 100),
          Aflatoxin_Total_ppb: product.aflatoxinTotal,
          Pesticide_Residue_Total_ppm: Math.round(product.pesticideResidue * 100),
      };

      const qualityData = {
          Moisture_Content_Pct: Math.round(product.moistureContent * 100),
          Essential_Oil_Pct: Math.round(product.essentialOil * 100),
          Chlorophyll_Index: product.chlorophyllIndex,
          Leaf_Spots_Count: product.leafSpots,
          Discoloration_Index: product.discoloration,
          Total_Bacterial_Count_CFU_g: product.bacterialCount,
          Total_Fungal_Count_CFU_g: product.fungalCount,
          E_coli_Present: product.ecoliPresent,
          Salmonella_Present: product.salmonellaPresent,
          DNA_Marker_Authenticity: product.dnaAuthenticity,
      };

      const tx = await contract.recordAllData(
          basicData,
          environmentData,
          soilData,
          contaminantsData,
          qualityData
      );

      setLoaderText("Syncing with database...");
    const {data} =   await axios.post("https://bkdoflab.onrender.com/StoreInDB", {
          ...product,
          certificateIpfsHash,
          licenseId: user?.licenseId || "N/A",
      });
      if(data.success){
        UseNav("dashboard");
      }
      toast({ title: "Database Sync Success", description: "Data stored in the database." });
      setLoaderText("Storing data on blockchain... Please confirm in your wallet.");
      await tx.wait(); 
      toast({ title: "Blockchain Success", description: "All data stored in one transaction." });
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.message || "An unknown error occurred.";
      toast({
        title: "Process Failed",
        description: `Could not complete the process. Error: ${errorMessage}`,
        variant: "destructive",
      });
      setStep("preview");
    } finally {
      setLoading(false);
      setLoaderText("Processing...");
    }
  };

  // ------------------ Loader UI (overlay) ------------------
  const LoaderOverlay = () => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-800 text-white">
      <div className="w-20 h-20 border-4 border-t-transparent border-white rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-bold animate-pulse">{loaderText}</h2>
      <p className="text-sm opacity-80 mt-2 text-center max-w-xs">This may take a moment. Please wait.</p>
    </div>
  );

  // ------------------ Top Flow Bar ------------------
  const FlowBar = ({ currentStep }: { currentStep: string }) => {
    const flowStages = ["form", "analysis", "preview", "blockchain"];
    const stageLabels: { [key: string]: string } = {
        form: "Data Entry",
        analysis: "AI Analysis",
        preview: "Certificate",
        blockchain: "Blockchain",
    };

    const getCurrentStage = (step: string) => {
        if (step === 'form') return 'form';
        if (step === 'ai-running' || step === 'ai-result' || step === 'anomaly') return 'analysis';
        if (step === 'preview') return 'preview';
        if (step === 'blockchain') return 'blockchain';
        return 'form';
    };
    
    const currentStage = getCurrentStage(currentStep);
    const currentStageIndex = flowStages.indexOf(currentStage);

    return (
      <div className="flex items-center justify-center gap-4 mb-6">
        {flowStages.map((stageKey, idx) => {
          const isActive = idx === currentStageIndex;
          const isDone = idx < currentStageIndex;
          
          return (
            <div key={stageKey} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all
                  ${isActive ? "bg-blue-600 text-white scale-110" : isDone ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
              >
                {idx + 1}
              </div>
              <div className={`text-xs font-medium ${isActive ? "text-blue-700" : isDone ? "text-green-700" : "text-gray-500"}`}>
                {stageLabels[stageKey]}
              </div>
              {idx < flowStages.length - 1 && <div className="w-8 h-0.5 bg-gray-300 mx-2" />}
            </div>
          );
        })}
      </div>
    );
  };
  
  const resultEntries = [
    { key: 'temperature', label: 'Temperature', unit: '°C' },
    { key: 'humidity', label: 'Humidity', unit: '%' },
    { key: 'soilPh', label: 'Soil pH', unit: 'pH' },
    { key: 'moistureContent', label: 'Moisture Content', unit: '%' },
    { key: 'essentialOil', label: 'Essential Oil', unit: '%' },
    { key: 'pesticideResidue', label: 'Pesticide Residue', unit: 'ppm' },
    { key: 'heavyMetalPb', label: 'Lead (Pb)', unit: 'mg/kg' },
    { key: 'aflatoxinTotal', label: 'Aflatoxin', unit: 'ppb' },
    { key: 'bacterialCount', label: 'Bacterial Count', unit: 'CFU/g' },
    { key: 'dnaAuthenticity', label: 'DNA Authenticity', unit: '%' },
  ];

  // ------------------ Main Render ------------------
  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {loading && <LoaderOverlay />}

      <div className="max-w-5xl mx-auto">
        <div className="mb-4 flex items-center gap-3">
          <Button variant="ghost" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <FlowBar currentStep={step} />

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">Research Data Entry: {product.batchId}</h1>
            <p className="text-sm text-gray-500">Fill or verify test parameters, then click Analyze.</p>
            <CollapsibleCard
                title="Environmental & Soil Conditions"
                description="Temperature, humidity, soil parameters"
                open={openSections.environmental}
                toggle={() => toggleSection("environmental")}
                inputs={[
                    { id: "temperature", label: "Temperature (°C)", value: product.temperature },
                    { id: "humidity", label: "Humidity (%)", value: product.humidity },
                    { id: "storageTime", label: "Storage Time (days)", value: product.storageTime },
                    { id: "lightExposure", label: "Light Exposure (hrs/day)", value: product.lightExposure },
                    { id: "soilPh", label: "Soil pH", value: product.soilPh },
                    { id: "soilMoisture", label: "Soil Moisture (%)", value: product.soilMoisture },
                    { id: "soilNitrogen", label: "Soil Nitrogen (mg/kg)", value: product.soilNitrogen },
                ]}
                onInputChange={handleInputChange}
            />
            <CollapsibleCard
                title="Contaminants & Safety"
                description="Heavy metals and toxins"
                open={openSections.contaminants}
                toggle={() => toggleSection("contaminants")}
                inputs={[
                    { id: "heavyMetalPb", label: "Lead (Pb)", value: product.heavyMetalPb },
                    { id: "heavyMetalAs", label: "Arsenic (As)", value: product.heavyMetalAs },
                    { id: "heavyMetalHg", label: "Mercury (Hg)", value: product.heavyMetalHg },
                    { id: "heavyMetalCd", label: "Cadmium (Cd)", value: product.heavyMetalCd },
                    { id: "aflatoxinTotal", label: "Aflatoxin (ppb)", value: product.aflatoxinTotal },
                    { id: "pesticideResidue", label: "Pesticide Residue (ppm)", value: product.pesticideResidue },
                ]}
                onInputChange={handleInputChange}
            />
            <CollapsibleCard
                title="Biochemical Properties"
                description="Moisture, oils, chlorophyll"
                open={openSections.biochemical}
                toggle={() => toggleSection("biochemical")}
                inputs={[
                    { id: "moistureContent", label: "Moisture Content (%)", value: product.moistureContent },
                    { id: "essentialOil", label: "Essential Oil (%)", value: product.essentialOil },
                    { id: "chlorophyllIndex", label: "Chlorophyll Index", value: product.chlorophyllIndex },
                ]}
                onInputChange={handleInputChange}
            />
            <CollapsibleCard
                title="Microbial Analysis"
                description="Bacterial & fungal counts, pathogens"
                open={openSections.microbial}
                toggle={() => toggleSection("microbial")}
                inputs={[
                    { id: "leafSpots", label: "Leaf Spots", value: product.leafSpots },
                    { id: "discoloration", label: "Discoloration", value: product.discoloration },
                    { id: "bacterialCount", label: "Bacterial Count", value: product.bacterialCount },
                    { id: "fungalCount", label: "Fungal Count", value: product.fungalCount },
                    { id: "ecoliPresent", label: "E. coli Present", value: product.ecoliPresent },
                    { id: "salmonellaPresent", label: "Salmonella Present", value: product.salmonellaPresent },
                ]}
                onInputChange={handleInputChange}
            />
            <CollapsibleCard
                title="Genetic Authenticity"
                description="DNA authenticity test"
                open={openSections.genetic}
                toggle={() => toggleSection("genetic")}
                inputs={[{ id: "dnaAuthenticity", label: "DNA Authenticity (%)", value: product.dnaAuthenticity }]}
                onInputChange={handleInputChange}
            />
            <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => toast({ title: "Draft", description: "Draft saved." })} className="flex-1">
                    <Save className="mr-2 h-4 w-4" /> Save Draft
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    Analyze & Generate Certificate
                </Button>
            </div>
          </form>
        )}

        {step === "ai-result" && modalContent && (
            <div className="flex flex-col items-center text-center space-y-6 bg-white p-8 rounded-2xl shadow-md">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h2 className="text-3xl font-bold text-gray-800">AI Analysis Complete</h2>
                <p className="text-green-600 font-semibold text-lg">No Anomalies Detected</p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left w-full max-w-2xl">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">AI Summary:</h3>
                    <p className="text-sm text-gray-600 italic">"{modalContent.summary}"</p>
                    {modalContent.quality_rating && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-700">
                                Estimated Quality Rating: 
                                <span className="ml-2 font-bold text-blue-600">{modalContent.quality_rating} / 10</span>
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <Button onClick={() => setStep("form")} variant="outline">Back to Form</Button>
                    <Button onClick={() => setStep("preview")} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Proceed to Certificate <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        )}

        {step === "preview" && product && (
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-3xl font-bold text-blue-700">Certificate Preview</h2>
            <p className="text-gray-600 max-w-xl text-center">
              Review the certificate below. You may download it as a PDF or store it permanently on the blockchain.
            </p>
            <div
              ref={certificateRef}
              className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 md:p-8 border"
            >
              <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
                <div className="text-center" style={{ color: "#42b13f" }}>
                  <h1 className="text-2xl md:text-3xl font-bold">Ayurvedic Report</h1>
                  <p className="text-sm">Laboratory of Ayurvedic Crops Sikkim</p>
                </div>
                <div className="mt-3">
                  <div className="bg-green-200 text-center font-bold py-2 rounded">Result: Passed</div>
                </div>
                <div className="mt-6 flex flex-col md:flex-row md:justify-between gap-4">
                  <div className="w-full md:w-1/2 text-sm leading-relaxed">
                    <p><strong>License ID:</strong> {user?.licenseId ?? "N/A"}</p>
                    <p><strong>Lab Name:</strong> {user?.laboratoryName ?? "N/A"}</p>
                    <p><strong>Farmer(Batch ID):</strong> {product.batchId}</p>
                    <p><strong>Farmer Name:</strong> Kiran Rathod</p>
                  </div>
                  <div className="w-full md:w-1/2 text-sm leading-relaxed">
                    <p><strong>Address:</strong></p>
                    <p>{user?.location ?? "N/A"}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold">Lab Results</h3>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full border-collapse" style={{ border: "1px solid #7ab97a" }}>
                      <thead>
                        <tr style={{ background: "#3e823e", color: "#fff" }}>
                          <th className="p-2 text-left">Parameter</th>
                          <th className="p-2 text-center">Value</th>
                          <th className="p-2 text-center">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultEntries.map((entry) => (
                          <tr key={entry.key} className="border-t">
                            <td className="p-2 font-medium">{entry.label}</td>
                            <td className="p-2 text-center">{String(product[entry.key as keyof ProductData])}</td>
                            <td className="p-2 text-center text-gray-600">{entry.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <div className="bg-green-100 px-3 py-2 rounded text-sm">
                    Validated By: {user?.laboratoryName}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Button onClick={handleDownloadPDF} className="bg-gray-700 hover:bg-gray-800 text-white">
                Download PDF
              </Button>
              <Button onClick={handleStoreOnBlockchain} className="bg-blue-600 hover:bg-blue-700 text-white">
                Store on Blockchain & Finish
              </Button>
            </div>
          </div>
        )}

        {step === "anomaly" && modalContent && (
          <div className="flex flex-col items-center text-center space-y-6">
             <h2 className="text-3xl font-bold text-red-600">⚠️ Anomaly Detected</h2>
            <p className="text-gray-700 max-w-lg">{modalContent.summary}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left w-full max-w-2xl">
               <h3 className="text-lg font-semibold mb-2 text-red-700">Detected Parameters:</h3>
               <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
                {modalContent.anomalies?.map((a, idx) => (
                  <li key={idx}>
                    <strong>{a.parameter}</strong> — expected {a.expected_range}, got {a.actual_value}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setStep("form")} variant="outline">Back to Form</Button>
              <Button onClick={() => toast({ title: "Manual Review", description: "Flagged for manual review." })} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Flag for Manual Review
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Reusable Components ---

const InputSection = ({ id, label, value, onChange }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type="text" value={value} onChange={(e) => onChange && onChange(id, e.target.value)} />
  </div>
);

const CollapsibleCard = ({ title, description, open, toggle, inputs, onInputChange }: any) => (
  <Card>
    <Collapsible open={open} onOpenChange={toggle}>
      <CollapsibleTrigger asChild>
        <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </div>
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {inputs?.map((inp: any) => (
            <InputSection key={inp.id} id={inp.id} label={inp.label} value={inp.value} onChange={onInputChange} />
          ))}
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  </Card>
);

export default ProductDetails;

