import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import RentalRequest from "./pages/RentalRequest";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Motoristas from "./pages/admin/Motoristas";
import Veiculos from "./pages/admin/Veiculos";
import Solicitacoes from "./pages/admin/Solicitacoes";
import Contratos from "./pages/admin/Contratos";
import ContratoDigital from "./pages/ContratoDigital";
import DriverLayout from "./layouts/DriverLayout";
import MyRequests from "./pages/MyRequests";
import ActiveRentals from "./pages/ActiveRentals";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Driver routes */}
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DriverLayout><Dashboard /></DriverLayout>} />
            <Route path="/solicitacoes" element={<DriverLayout><MyRequests /></DriverLayout>} />
            <Route path="/alugueis" element={<DriverLayout><ActiveRentals /></DriverLayout>} />
            <Route path="/rental-request/:carId" element={<DriverLayout><RentalRequest /></DriverLayout>} />
            <Route path="/contrato/:id" element={<DriverLayout><ContratoDigital /></DriverLayout>} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/motoristas" element={<AdminLayout><Motoristas /></AdminLayout>} />
            <Route path="/admin/veiculos" element={<AdminLayout><Veiculos /></AdminLayout>} />
            <Route path="/admin/solicitacoes" element={<AdminLayout><Solicitacoes /></AdminLayout>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
