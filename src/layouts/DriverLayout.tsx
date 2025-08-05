import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DriverSidebar } from "@/components/DriverSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface DriverLayoutProps {
  children: React.ReactNode;
}

const DriverLayout: React.FC<DriverLayoutProps> = ({ children }) => {
  const { isAuthenticated, isDriver } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isDriver) {
      navigate("/");
    }
  }, [isAuthenticated, isDriver, navigate]);

  if (!isAuthenticated || !isDriver) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DriverSidebar />

        <SidebarInset>
          <header className="h-12 flex items-center border-b bg-background">
            <SidebarTrigger className="ml-2" />
            <div className="ml-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                Painel do Motorista - RentCar
              </h2>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DriverLayout;