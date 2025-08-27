// src/pages/RegisterChoice.tsx
import { Link } from "react-router-dom";
import { Car, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import loginBg from "@/assets/login-bg.png";
import banner from "@/assets/banner.png";

const bgStyle: React.CSSProperties = {
  backgroundImage: `url(${loginBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function RegisterChoice() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={bgStyle}>
      <Card
        className="w-full max-w-md bg-white/100 backdrop-blur-sm shadow-2xl rounded-2xl border-0 overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Banner topo do card (igual ao Login) */}
        <div className="h-28 md:h-32 w-full bg-white/95 border-b border-white/40">
          <div
            className="h-full w-full bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${banner})`,
              backgroundSize: "cover", // use "contain" se quiser ver o banner inteiro sem cortes
            }}
          />
        </div>

        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: "#122447" }}>
            Como você quer usar a LocaPoços?
          </h1>
          <p className="text-sm" style={{ color: "#347BA7" }}>
            Escolha uma opção para continuar seu cadastro
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Opção: Motorista */}
            <Link
              to="/register-motorista"
              className="group flex items-center w-full rounded-xl border border-slate-200 hover:shadow-md transition p-4"
            >
              <KeyRound className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1 ml-3">
                <div className="font-semibold leading-snug">Quero alugar um carro</div>
                <div className="text-xs text-slate-500">Cadastro de motorista</div>
              </div>
              <span className="text-sm font-medium whitespace-nowrap" style={{ color: "#6AA98E" }}>
                Continuar →
              </span>
            </Link>

            {/* Opção: Proprietário */}
            <Link
              to="/register-proprietario"
              className="group flex items-center w-full rounded-xl border border-slate-200 hover:shadow-md transition p-4"
            >
              <Car className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1 ml-3">
                <div className="font-semibold leading-snug">Quero colocar meu carro para alugar</div>
                <div className="text-xs text-slate-500">Cadastro de proprietário</div>
              </div>
              <span className="text-sm font-medium whitespace-nowrap" style={{ color: "#6AA98E" }}>
                Continuar →
              </span>
            </Link>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link to="/" className="hover:underline" style={{ color: "#347BA7" }}>
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
