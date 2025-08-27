import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import banner from "@/assets/banner.png";
import loginBg from "@/assets/login-bg.png";

const API_BASE = import.meta.env.VITE_API_URL || "";
const ENDPOINT = `${API_BASE}/proprietarios`; // ajuste se sua API montar em outro prefixo

const bgStyle: React.CSSProperties = {
    backgroundImage: `url(${loginBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
};

export default function RegisterProprietario() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefone: "",
        cpf_cnpj: "",
        senha: "",
        confirmacao: "",
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);

        if (!form.nome || !form.email || !form.cpf_cnpj || !form.senha) {
            setMsg({ type: "err", text: "Preencha nome, e-mail, CPF/CNPJ e senha." });
            return;
        }
        if (form.senha !== form.confirmacao) {
            setMsg({ type: "err", text: "Senha e confirmação não conferem." });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: form.nome,
                    email: form.email,
                    telefone: form.telefone || null,
                    cpf_cnpj: form.cpf_cnpj,
                    senha: form.senha,
                }),
            });

            // Lê o corpo como texto para não quebrar se vier vazio
            const raw = await res.text();
            const isJson =
                res.headers.get("content-type")?.toLowerCase().includes("application/json");
            const data = isJson && raw ? JSON.parse(raw) : raw;

            if (!res.ok) {
                // Mostra mensagem vinda da API se houver
                const msgApi =
                    (typeof data === "object" && (data?.error || data?.message)) || raw || "";
                throw new Error(msgApi || `Erro HTTP ${res.status}`);
            }

            setMsg({
                type: "ok",
                text: "Cadastro enviado com sucesso! Aguarde aprovação do administrador.",
            });

            setTimeout(() => navigate("/"), 1200);
        } catch (err: any) {
            setMsg({ type: "err", text: err.message || "Falha ao enviar cadastro." });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={bgStyle}>
            <Card
                className="w-full max-w-md bg-white rounded-2xl border-0 overflow-hidden shadow-2xl"
                style={{ boxShadow: "var(--shadow-card)" }}
            >
                {/* Banner topo do card (mesmo do Login/RegisterChoice) */}
                <div className="h-28 md:h-32 w-full bg-white border-b border-white/40">
                    <div
                        className="h-full w-full bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${banner})`, backgroundSize: "contain" }}
                    />
                </div>

                <CardHeader className="flex flex-col items-center text-center space-y-2">
                    <h1 className="text-2xl font-bold" style={{ color: "#122447" }}>
                        Cadastro de proprietário
                    </h1>
                    <p className="text-sm" style={{ color: "#347BA7" }}>
                        Preencha seus dados para disponibilizar seu veículo
                    </p>
                </CardHeader>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="nome">Nome</Label>
                            <Input id="nome" name="nome" value={form.nome} onChange={onChange} required />
                        </div>

                        <div>
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                                id="telefone"
                                name="telefone"
                                placeholder="(xx) xxxxx-xxxx"
                                value={form.telefone}
                                onChange={onChange}
                            />
                        </div>

                        <div>
                            <Label htmlFor="cpf_cnpj">CPF ou CNPJ</Label>
                            <Input
                                id="cpf_cnpj"
                                name="cpf_cnpj"
                                placeholder="Somente números"
                                value={form.cpf_cnpj}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="senha">Senha</Label>
                            <Input
                                id="senha"
                                name="senha"
                                type="password"
                                value={form.senha}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirmacao">Confirmar senha</Label>
                            <Input
                                id="confirmacao"
                                name="confirmacao"
                                type="password"
                                value={form.confirmacao}
                                onChange={onChange}
                                required
                            />
                        </div>

                        {msg && (
                            <div
                                className={`text-sm ${msg.type === "ok" ? "text-emerald-600" : "text-red-600"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-white"
                            style={{ backgroundColor: "#347BA7" }}
                            disabled={loading}
                        >
                            {loading ? "Enviando..." : "Cadastrar proprietário"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <Link to="/register-choice" className="hover:underline" style={{ color: "#347BA7" }}>
                            Voltar para as opções
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
