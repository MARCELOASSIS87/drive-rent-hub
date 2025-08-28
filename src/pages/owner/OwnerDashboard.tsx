// src/pages/owner/OwnerDashboard.tsx
import { Link } from "react-router-dom";
import { Car, FileText, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OwnerDashboard() {
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Painel do Proprietário
        </h1>
        <p className="text-muted-foreground">
          Gerencie seus veículos e contratos
        </p>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Car className="w-5 h-5" />
            <h3 className="font-semibold">Meus veículos</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Cadastre e acompanhe seus veículos disponíveis para aluguel.
          </p>
          <div className="flex gap-2">
            <Button asChild className="h-9">
              <Link to="/owner/veiculos">Abrir</Link>
            </Button>
            <Button asChild variant="outline" className="h-9">
              <Link to="/owner/veiculos/novo">
                <PlusCircle className="w-4 h-4 mr-1" />
                Novo
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5" />
            <h3 className="font-semibold">Contratos</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Acompanhe solicitações, contratos ativos e histórico.
          </p>
          <Button asChild className="h-9">
            <Link to="/owner/contratos">Ver contratos</Link>
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5" />
            <h3 className="font-semibold">Documentos</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Envie e gerencie seus documentos (CNH/CRLV/Comprovantes).
          </p>
          <Button asChild variant="outline" className="h-9">
            <Link to="/owner/documentos">Gerenciar</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
