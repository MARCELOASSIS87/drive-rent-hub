// src/layouts/OwnerLayout.tsx
import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import OwnerSidebar from "@/components/OwnerSidebar";

type Props = { children: ReactNode };

export default function OwnerLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <OwnerSidebar />
        <SidebarInset className="flex-1 p-6">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
