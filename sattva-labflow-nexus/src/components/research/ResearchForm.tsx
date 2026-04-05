import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, ChevronDown, Save, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TulsiParameter {
  parameter: string;
  value: string;
  type?: "text" | "select";
  options?: string[];
}

const tulsiParameters: TulsiParameter[] = [
  { parameter: "Temperature_C", value: "20–35", type: "text" },
  { parameter: "Humidity_%", value: "50–70", type: "text" },
  { parameter: "Storage_Time_Days", value: "90–120", type: "text" },
  { parameter: "Light_Exposure_hours_per_day", value: "5–7", type: "text" },
  { parameter: "Soil_pH", value: "6.0–7.5", type: "text" },
  { parameter: "Soil_Moisture_%", value: "15–25", type: "text" },
  { parameter: "Soil_Nitrogen_mgkg", value: "300–500", type: "text" },
  { parameter: "Soil_Phosphorus_mgkg", value: "30–60", type: "text" },
  { parameter: "Soil_Potassium_mgkg", value: "200–400", type: "text" },
  { parameter: "Soil_Organic_Carbon_%", value: "0.5–1.2", type: "text" },
  { parameter: "Heavy_Metal_Pb_ppm", value: "0–2", type: "text" },
  { parameter: "Heavy_Metal_As_ppm", value: "0–0.5", type: "text" },
  { parameter: "Heavy_Metal_Hg_ppm", value: "0–0.05", type: "text" },
  { parameter: "Heavy_Metal_Cd_ppm", value: "0–0.2", type: "text" },
  { parameter: "Aflatoxin_Total_ppb", value: "0–10", type: "text" },
  { parameter: "Pesticide_Residue_Total_ppm", value: "0–0.5", type: "text" },
  { parameter: "Moisture_Content_%", value: "8–12", type: "text" },
  { parameter: "Essential_Oil_%", value: "0.5–1.5", type: "text" },
  { parameter: "Chlorophyll_Index", value: "25–40", type: "text" },
  { parameter: "Leaf_Spots_Count", value: "0–5", type: "text" },
  { parameter: "Discoloration_Index", value: "0–2", type: "text" },
  { parameter: "Total_Bacterial_Count_CFU_g", value: "10³–10⁴", type: "text" },
  { parameter: "Total_Fungal_Count_CFU_g", value: "10²–10³", type: "text" },
  { parameter: "E_coli_Present", value: "No", type: "select", options: ["Yes", "No"] },
  { parameter: "Salmonella_Present", value: "No", type: "select", options: ["Yes", "No"] },
  { parameter: "DNA_Marker_Authenticity", value: "100%", type: "select", options: ["100%", "Inconclusive"] },
];

export const TulsiForm = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const { batchId } = useParams<{ batchId: string }>();
  const [formData, setFormData] = useState<any>({});
  const [openSections, setOpenSections] = useState({
    environmental: true,
    contaminants: false,
    biochemical: false,
    microbial: false,
    genetic: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (param: string, value: string) => {
    setFormData({ ...formData, [param]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Research Submitted", description: "Tulsi parameters saved successfully." });
    setTimeout(() => onNavigate("dashboard"), 1500);
  };

  const handleSaveDraft = () => {
    toast({ title: "Draft Saved", description: "Tulsi research draft saved." });
  };

  // Categorize parameters for collapsible sections
  const sections = {
    environmental: ["Temperature_C", "Humidity_%", "Storage_Time_Days", "Light_Exposure_hours_per_day", "Soil_pH", "Soil_Moisture_%", "Soil_Nitrogen_mgkg", "Soil_Phosphorus_mgkg", "Soil_Potassium_mgkg", "Soil_Organic_Carbon_%"],
    contaminants: ["Heavy_Metal_Pb_ppm", "Heavy_Metal_As_ppm", "Heavy_Metal_Hg_ppm", "Heavy_Metal_Cd_ppm", "Aflatoxin_Total_ppb", "Pesticide_Residue_Total_ppm"],
    biochemical: ["Moisture_Content_%", "Essential_Oil_%", "Chlorophyll_Index", "Leaf_Spots_Count", "Discoloration_Index"],
    microbial: ["Total_Bacterial_Count_CFU_g", "Total_Fungal_Count_CFU_g", "E_coli_Present", "Salmonella_Present"],
    genetic: ["DNA_Marker_Authenticity"]
  };

  const getParamsBySection = (section: keyof typeof sections) =>
    tulsiParameters.filter(p => sections[section].includes(p.parameter));

  return (
    <div className="min-h-screen bg-background p-6">
      <Button variant="ghost" onClick={() => onNavigate("dashboard")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold text-foreground mb-1">Tulsi Research Data Entry</h1>
      <p className="text-muted-foreground mb-6">Batch ID: {batchId}</p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        {Object.keys(sections).map((section) => (
          <CollapsibleCard
            key={section}
            title={section.charAt(0).toUpperCase() + section.slice(1)}
            description=""
            open={openSections[section as keyof typeof openSections]}
            toggle={() => toggleSection(section as keyof typeof openSections)}
            inputs={getParamsBySection(section as keyof typeof sections)}
            formData={formData}
            handleChange={handleChange}
          />
        ))}

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={handleSaveDraft} className="flex-1">
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button type="submit" className="flex-1 bg-gradient-primary hover:bg-primary-hover">
            <Send className="mr-2 h-4 w-4" /> Submit Results
          </Button>
        </div>
      </form>
    </div>
  );
};

// Collapsible card
const CollapsibleCard = ({ title, description, open, toggle, inputs, formData, handleChange }: any) => (
  <Card className="shadow-card">
    <Collapsible open={open} onOpenChange={toggle}>
      <CollapsibleTrigger asChild>
        <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {inputs.map((inp: TulsiParameter) =>
            inp.type === "text" ? (
              <div key={inp.parameter} className="space-y-2">
                <Label>{inp.parameter.replace(/_/g, " ")}</Label>
                <Input
                  placeholder={inp.value}
                  value={formData[inp.parameter] || ""}
                  onChange={(e) => handleChange(inp.parameter, e.target.value)}
                />
              </div>
            ) : (
              <div key={inp.parameter} className="space-y-2">
                <Label>{inp.parameter.replace(/_/g, " ")}</Label>
                <Select
                  value={formData[inp.parameter] || ""}
                  onValueChange={(val) => handleChange(inp.parameter, val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={inp.value} />
                  </SelectTrigger>
                  <SelectContent>
                    {inp.options?.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          )}
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  </Card>
);
