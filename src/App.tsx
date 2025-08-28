import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/driver/Dashboard";
import RentalRequest from "./pages/driver/RentalRequest";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Motoristas from "./pages/admin/Motoristas";
import Veiculos from "./pages/admin/Veiculos";
import Solicitacoes from "./pages/admin/Solicitacoes";
import Contratos from "./pages/admin/Contratos";
import ContratoDigital from "./pages/driver/ContratoDigital";
import DriverLayout from "./layouts/DriverLayout";
import MyRequests from "./pages/driver/MyRequests";
import ActiveRentals from "./pages/driver/ActiveRentals";
import RegisterChoice from "./pages/RegisterChoice";
import RegisterProprietario from "./pages/RegisterProprietario";
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerVeiculos from "./pages/owner/OwnerVeiculos";
import OwnerContratos from "./pages/owner/OwnerContratos";
import OwnerDocumentos from "./pages/owner/OwnerDocumentos";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/register-choice" element={<RegisterChoice />} />
            <Route path="/register-proprietario" element={<RegisterProprietario />} />
            <Route path="/register" element={<Register />} />
            {/* Driver routes */}
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DriverLayout><Dashboard /></DriverLayout>} />
            <Route path="/solicitacoes" element={<DriverLayout><MyRequests /></DriverLayout>} />
            <Route path="/alugueis" element={<DriverLayout><ActiveRentals /></DriverLayout>} />
            <Route path="/rental-request/:carId" element={<DriverLayout><RentalRequest /></DriverLayout>} />
            <Route path="/contrato/:id" element={<DriverLayout><ContratoDigital /></DriverLayout>} />


            {/*Owner Routes*/}
            <Route path="/owner" element={<OwnerLayout><OwnerDashboard /></OwnerLayout>} />
            <Route path="/owner/veiculos" element={<OwnerLayout><OwnerVeiculos /></OwnerLayout>} />
            <Route path="/owner/contratos" element={<OwnerLayout><OwnerContratos /></OwnerLayout>} />
            <Route path="/owner/documentos" element={<OwnerLayout><OwnerDocumentos /></OwnerLayout>} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/motoristas" element={<AdminLayout><Motoristas /></AdminLayout>} />
            <Route path="/admin/veiculos" element={<AdminLayout><Veiculos /></AdminLayout>} />
            <Route path="/admin/solicitacoes" element={<AdminLayout><Solicitacoes /></AdminLayout>} />
            <Route path="/admin/contratos" element={<AdminLayout><Contratos /></AdminLayout>
            }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
