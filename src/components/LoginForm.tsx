import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import { authAPI } from "@/services/api";
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

    try {
      const response = await authAPI.loginDriver(email, password);
      const { token, motorista } = response.data;

      // Store auth data
      login(token, {
        id: motorista.id,
        nome: motorista.nome,
        email: motorista.email,
        role: 'driver'
      });

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${motorista.nome}`,
      });

      navigate("/dashboard");
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string } };
      };
      const errorMessage =
        err.response?.data?.error ||
        "Erro ao fazer login. Tente novamente.";
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
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