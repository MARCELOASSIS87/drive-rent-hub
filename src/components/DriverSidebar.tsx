import { Car, FileText, ClipboardCheck, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Carros", url: "/dashboard", icon: Car },
  { title: "Solicitações", url: "/solicitacoes", icon: FileText },
  { title: "Aluguéis Ativos", url: "/alugueis", icon: ClipboardCheck },
];

export function DriverSidebar() {
  const { state } = useSidebar();
  const { logout, user } = useAuth();

  const isCollapsed = state === "collapsed";
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                <span>RentCar</span>
              </div>
            )}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t">
          {!isCollapsed && user && (
            <div className="mb-3">
              <p className="text-sm font-medium">{user.nome}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}
          <Button
            variant="outline"
            size={isCollapsed ? "icon" : "sm"}
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default DriverSidebar;