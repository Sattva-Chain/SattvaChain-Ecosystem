import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, QrCode, Download, Share, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface BatchCreationProps {
  onNavigate: (view: string) => void;
}

export const BatchCreation = ({ onNavigate }: BatchCreationProps) => {
  const navgiet = useNavigate()
  const [batchId, setBatchId] = useState("");
  const generateBatchId = () => {
    const id = `BTH-${Date.now().toString().slice(-6)}`;
    setBatchId(id);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) generateBatchId();
    toast({
      title: "Batch Created",
      description: `Batch ${batchId || "BTH-" + Date.now().toString().slice(-6)} created successfully. Status: Testing`
    });
    // Navigate back to dashboard to show the new batch
    setTimeout(() => navgiet("dashboard"), 1500);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navgiet("dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Create New Batch</h1>
        <p className="text-muted-foreground mt-1">Create a new herb testing batch (QR code generated after blockchain validation)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Creation Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
            <CardDescription>Enter details for the new herb testing batch</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateBatch} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchId">Batch ID</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="batchId" 
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                      placeholder="BTH-001234" 
                    />
                    <Button type="button" variant="outline" onClick={generateBatchId}>
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="herbType">Herb Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select herb" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ashwagandha">Ashwagandha</SelectItem>
                      <SelectItem value="turmeric">Turmeric</SelectItem>
                      <SelectItem value="brahmi">Brahmi</SelectItem>
                      <SelectItem value="tulsi">Tulsi</SelectItem>
                      <SelectItem value="neem">Neem</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" placeholder="Supplier name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin Location</Label>
                  <Input id="origin" placeholder="Farm location" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Sample Quantity (kg)</Label>
                  <Input id="quantity" type="number" step="0.1" placeholder="1.5" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date</Label>
                  <Input id="harvestDate" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any special observations or handling instructions..."
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:bg-primary-hover"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Batch
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Batch Status Info */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Batch Workflow</CardTitle>
            <CardDescription>
              Batch lifecycle phases in Sattva Chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Workflow Steps */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <p className="font-medium">Testing Phase</p>
                    <p className="text-sm text-muted-foreground">Batch created, ready for laboratory testing</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <p className="font-medium text-muted-foreground">Completed Phase</p>
                    <p className="text-sm text-muted-foreground">All laboratory data entered and validated</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <p className="font-medium text-muted-foreground">QR Generated Phase</p>
                    <p className="text-sm text-muted-foreground">Blockchain validation complete, consumer QR ready</p>
                  </div>
                </div>
              </div>

              {batchId && (
                <div className="bg-secondary/50 p-4 rounded-lg mt-6">
                  <h4 className="font-medium mb-2">Current Batch</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>ID: {batchId}</p>
                    <p>Status: Testing Phase</p>
                    <p>Next Step: Enter laboratory research data</p>
                  </div>
                  <Button 
                    onClick={() => onNavigate("research")}
                    className="w-full mt-3 bg-gradient-primary hover:bg-primary-hover"
                  >
                    Enter Research Data
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};