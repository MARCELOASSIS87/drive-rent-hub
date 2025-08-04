import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Car, Mail, Lock, Loader2 } from "lucide-react";
import { authAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

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
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Erro ao fazer login. Tente novamente.";
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <div className="w-full max-w-md space-y-6">
        {/* Logo e título */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <Car className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">RentCar Pro</h1>
            <p className="text-muted-foreground">Aluguel de carros para motoristas</p>
          </div>
        </div>

        {/* Formulário de Login */}
        <Card className="shadow-lg border-0" style={{ boxShadow: 'var(--shadow-card)' }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">Entrar</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Acesse sua conta para gerenciar seus aluguéis
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
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
                  className="text-sm text-primary hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
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

            <div className="mt-6 text-center space-y-2">
              <Link 
                to="/register" 
                className="text-sm text-primary hover:underline"
              >
                Não tem uma conta? Cadastre-se
              </Link>
              <br />
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Esqueceu sua senha?
              </a>
            </div>

            <div className="mt-6 text-center">
              <Link 
                to="/admin/login" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Acesso Administrativo →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="mt-8 pt-6 border-t text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Car className="h-5 w-5" />
            <span className="text-lg font-bold">RentCar</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Aluguel de veículos para motoristas profissionais
          </p>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <a href="#" className="hover:text-primary">Termos de Uso</a>
          {" • "}
          <a href="#" className="hover:text-primary">Política de Privacidade</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;