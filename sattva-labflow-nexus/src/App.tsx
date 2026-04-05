import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AuthLayout } from "./components/auth/AuthLayout";
import { LabDashboard } from "./components/dashboard/LabDashboard";
import { BatchCreation } from "./components/batch/BatchCreation";
import { Analytics } from "./components/analytics/Analytics";
import { AuthProvider } from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";
import { ProductDetails } from "./components/ProductDetails";
import AllCerificateds from "./components/AllCerificateds";
import LabProfileAndCertificates from "./components/AllCerificateds";

// Your pages
const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<AuthLayout />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <LabDashboard />

              }
            />
            <Route
              path="/dashboard/batch"
              element={
                <PrivateRoute>
                  <BatchCreation />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/analytics"
              element={
                <PrivateRoute>
                  <Analytics />
                </PrivateRoute>
              }
            />

            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/AllCertificted" element={<LabProfileAndCertificates />} />
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);


export default App;
