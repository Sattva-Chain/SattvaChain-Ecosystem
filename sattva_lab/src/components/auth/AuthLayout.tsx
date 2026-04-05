import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Microscope, Leaf, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/auth";

interface AuthLayoutProps {
  onAuthenticated: () => void;
}

export const AuthLayout = ({ onAuthenticated }: AuthLayoutProps) => {
  const navigate = useNavigate();
  const {axioseInstance} = useAuth()
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const [formData, setFormData] = useState({
    laboratoryName: "",
    licenseId: "",
    email: "",
    password: "",
    location: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ---------------- REGISTER ----------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axioseInstance.post(
        "/register",
        { ...formData },
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate("/dashboard");
      }else{
        alert(`${response.data.message}`)
      }
    } catch (error: any) {
      console.error("Register Error:", error.response?.data || error.message);
   
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axioseInstance.post(
        "/loginlab",
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );

      console.log("Login Success:", response.data);
      onAuthenticated();
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-gradient-primary p-3 rounded-full">
              <Microscope className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex items-center space-x-1">
              <Leaf className="h-6 w-6 text-primary" />
              <Shield className="h-6 w-6 text-accent" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Sattva Chain
            </h1>
            <p className="text-muted-foreground mt-1">Laboratory Portal</p>
          </div>
        </div>

        {/* Auth Tabs */}
        <Card className="shadow-lab">
          <CardHeader className="text-center">
            <CardTitle>Laboratory Access</CardTitle>
            <CardDescription>
              Secure portal for herb testing and quality assurance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "login" | "register")} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register Lab</TabsTrigger>
              </TabsList>

              {/* ---------------- LOGIN FORM ---------------- */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@lab.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary hover:bg-primary-hover" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* ---------------- REGISTER FORM ---------------- */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="laboratoryName">Laboratory Name</Label>
                    <Input
                      id="laboratoryName"
                      placeholder="Herbal Research Lab"
                      required
                      value={formData.laboratoryName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseId">License ID</Label>
                    <Input
                      id="licenseId"
                      placeholder="LAB-2024-001"
                      required
                      value={formData.licenseId}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      required
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@lab.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary hover:bg-primary-hover" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register Laboratory"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Secure • Compliant • Blockchain-Verified
        </p>
      </div>
    </div>
  );
};
