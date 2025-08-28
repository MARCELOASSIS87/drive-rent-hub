import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import { api, authAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import banner from "@/assets/banner.png";
import loginBg from "@/assets/login-bg.png";

const bgStyle: React.CSSProperties = {
  backgroundImage: `url(${loginBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [perfil, setPerfil] = useState<'motorista' | 'proprietario'>('motorista');

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    toast({
      title: "Erro",
      description: "Por favor, preencha todos os campos.",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);
  console.group("[LOGIN]");
  console.log("start ►", { email, perfil });

  try {
    // ============================
    // 1) PROPRIETÁRIO primeiro (se selecionado)
    // ============================
    if (perfil === "proprietario") {
      const url = "/auth/login";
      console.log("[OWNER] POST", `${api.defaults.baseURL || ""}${url}`);

      // backend espera { email, senha }
      const res = await api.post(url, { email, senha: password });
      const data = res.data || {};

      if (!(data?.token && (data?.proprietario || data?.role === "proprietario"))) {
        console.warn("[OWNER] resposta inesperada:", data);
        throw new Error(
          data?.error || data?.message || "Resposta inválida do /auth/login (proprietário)."
        );
      }

      const p = data.proprietario ?? { id: data.id, nome: data.nome, email };
      // use aqui o literal que seu AuthContext aceita: "owner" OU "proprietario"
      login(data.token, {
        id: p.id,
        nome: p.nome,
        email: p.email,
        role: "proprietario", // troque para "proprietario" se for o literal do seu tipo
      });

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${p.nome} (proprietário)`,
      });

      console.log("[OWNER] ok → /owner");
      navigate("/owner", { replace: true });
      return;
    }

    // ============================
    // 2) MOTORISTA (fluxo original)
    // ============================
    console.log("[DRIVER] tentando authAPI.loginDriver()");
    const resDriver = await authAPI.loginDriver(email, password);
    const { token, motorista } = resDriver.data;

    login(token, {
      id: motorista.id,
      nome: motorista.nome,
      email: motorista.email,
      role: "driver",
    });

    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo, ${motorista.nome}`,
    });

    console.log("[DRIVER] ok → /dashboard");
    navigate("/dashboard", { replace: true });
    return;
  } catch (err: any) {
    console.error("[LOGIN] erro:", err?.response?.data?.error || err?.message || err);
    toast({
      title: "Erro no login",
      description: err?.response?.data?.error || err?.message || "Erro ao fazer login.",
      variant: "destructive",
    });
  } finally {
    console.groupEnd();
    setIsLoading(false);
  }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={bgStyle}
    >
      <Card
        className="w-full max-w-md bg-white/100 backdrop-blur-sm shadow-2xl rounded-2xl border-0 overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="h-28 md:h-32 w-full bg-white/95 border-b border-white/40">
          <div
            className="h-full w-full bg-center bg-no-repeat" style={{
              backgroundImage: `url(${banner})`,
              backgroundSize: "cover", // preenche a faixa inteira
            }}
          />
        </div>
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#122447]">
            Seja Bem vindo à LocaPoços!
          </h1>
          <p className="text-sm text-[#347BA7] mt-1">Faça seu login</p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="w-full flex items-center justify-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setPerfil('motorista')}
              className={`px-3 py-1.5 rounded-lg text-sm border ${perfil === 'motorista'
                ? 'bg-[#347BA7] text-white border-[#347BA7]'
                : 'bg-white text-slate-700 border-slate-300'
                }`}
            >
              Sou Motorista
            </button>
            <button
              type="button"
              onClick={() => setPerfil('proprietario')}
              className={`px-3 py-1.5 rounded-lg text-sm border ${perfil === 'proprietario'
                ? 'bg-[#347BA7] text-white border-[#347BA7]'
                : 'bg-white text-slate-700 border-slate-300'
                }`}
            >
              Sou Proprietário
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@seudominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-[#6AA98E] hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#347BA7] hover:bg-[#2c6a8f] text-white hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-[#347BA7]">
            Ainda não tem cadastro?{" "}
            <Link to="/register-choice" className="text-[#6AA98E] hover:underline">
              Cadastre-se
            </Link>

          </div>
        </CardContent>
      </Card>
    </div >
  );
};

export default LoginForm;