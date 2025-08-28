// src/pages/OwnerDashboard.tsx
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, FileText, PlusCircle } from "lucide-react";
import banner from "@/assets/banner.png";
import loginBg from "@/assets/login-bg.png";

const bgStyle: React.CSSProperties = {
  backgroundImage: `url(${loginBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function OwnerDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={bgStyle}>
      <Card className="w-full max-w-3xl bg-white rounded-2xl border-0 overflow-hidden shadow-2xl"
            style={{ boxShadow: "var(--shadow-card)" }}>
        {/* Banner topo (igual ao Login/RegisterChoice) */}
        <div className="h-28 md:h-32 w-full bg-white border-b border-white/40">
          <div
            className="h-full w-full bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${banner})`, backgroundSize: "contain" }}
          />
        </div>

        <CardHeader className="text-center space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: "#122447" }}>
            Painel do Proprietário
          </h1>
          <p className="text-sm" style={{ color: "#347BA7" }}>
            Gerencie seus veículos e contratos
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-5 h-5" />
                <h3 className="font-semibold">Meus veículos</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Cadastre e acompanhe seus veículos disponíveis para aluguel.
              </p>
              <div className="flex gap-2">
                <Button asChild className="h-9">
                  <Link to="/owner/veiculos">
                    Abrir
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-9">
                  <Link to="/owner/veiculos/novo">
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Novo
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5" />
                <h3 className="font-semibold">Contratos</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Acompanhe solicitações, contratos ativos e histórico.
              </p>
              <Button asChild className="h-9">
                <Link to="/owner/contratos">Ver contratos</Link>
              </Button>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5" />
                <h3 className="font-semibold">Documentos</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Envie e gerencie seus documentos (CNH/CRLV/Comprovantes).
              </p>
              <Button asChild className="h-9" variant="outline">
                <Link to="/owner/documentos">Gerenciar</Link>
              </Button>
            </div>
          </div>

          <div className="text-center text-sm mt-6">
            <Link to="/" className="hover:underline" style={{ color: "#347BA7" }}>
              Sair para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
