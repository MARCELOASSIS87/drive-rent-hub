import { Link } from "react-router-dom";
import { Car, KeyRound } from "lucide-react";
import banner from "@/assets/banner.png";
export default function RegisterChoice() {
    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
            style={{
                backgroundImage: `url(${import.meta.env.VITE_LOGIN_BG || "/login-bg.jpg"})`,
            }}
        >
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8">
                <div className="flex flex-col items-center text-center">
                    <img
                        src="/logo-locpocos.png"
                        alt="LocPoços — Locação de Veículos"
                        className="h-16 mb-4"
                    />
                    <h1 className="text-2xl font-bold" style={{ color: "#122447" }}>
                        Como você quer usar a LocaPoços?
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: "#347BA7" }}>
                        Escolha uma opção para continuar seu cadastro
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <Link
                        to="/register-motorista"
                        className="group flex items-center w-full rounded-xl border border-slate-200 hover:shadow-md transition p-4"
                    >
                        <KeyRound className="w-6 h-6 flex-shrink-0" />
                        <div className="flex-1 ml-3">
                            <div className="font-semibold leading-snug">
                                Quero alugar um carro
                            </div>
                        </div>

                    </Link>

                    <Link
                        to="/register-proprietario"
                        className="group flex items-center w-full rounded-xl border border-slate-200 hover:shadow-md transition p-4"
                    >
                        <KeyRound className="w-6 h-6 flex-shrink-0" />
                        <div className="flex-1 ml-3">
                            <div className="font-semibold leading-snug">
                                Quero colocar meu carro para alugar</div>
                        </div>

                    </Link>
                </div>

                <div className="mt-6 text-center text-sm">
                    <Link to="/" className="hover:underline" style={{ color: "#347BA7" }}>
                        Voltar para o login
                    </Link>
                </div>
            </div>
        </div>
    );
}
