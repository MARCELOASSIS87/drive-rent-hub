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
    <div 
      className="min-h-screen flex items-center justify-center p-4" 
      style={{ 
        background: 'linear-gradient(135deg, #DAEDF3 0%, #F8FCFD 50%, #E8F4F8 100%)'
      }}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Logo e título */}
        <div className="text-center space-y-6">
          <div className="mx-auto">
            <img 
              src="/logo-locpocos.png" 
              alt="LocPoços — Locação de Veículos" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold" style={{ color: '#122447' }}>LocPoços</h1>
            <p className="text-lg font-medium" style={{ color: '#347BA7' }}>Locação de Veículos</p>
            <p className="text-sm text-muted-foreground">Aluguel profissional para motoristas</p>
          </div>
        </div>

        {/* Formulário de Login */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm" style={{ boxShadow: '0 20px 40px rgba(18, 36, 71, 0.15)' }}>
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl font-bold text-center" style={{ color: '#122447' }}>Entrar</CardTitle>
            <p className="text-sm text-center" style={{ color: '#347BA7' }}>
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
                  className="text-sm hover:underline transition-colors"
                  style={{ color: '#6AA98E' }}
                >
                  Esqueci minha senha
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{ 
                  backgroundColor: '#347BA7',
                  color: '#FFFFFF'
                }}
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

            <div className="mt-6 text-center space-y-3">
              <Link 
                to="/register" 
                className="text-sm hover:underline transition-colors font-medium"
                style={{ color: '#6AA98E' }}
              >
                Não tem uma conta? Cadastre-se
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t text-center">
              <Link 
                to="/admin/login" 
                className="text-sm hover:underline transition-colors inline-flex items-center gap-1"
                style={{ color: '#347BA7' }}
              >
                Acesso Administrativo →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="mt-8 pt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Car className="h-5 w-5" style={{ color: '#6AA98E' }} />
            <span className="text-lg font-bold" style={{ color: '#122447' }}>LocPoços</span>
          </div>
          <p className="text-sm mb-4" style={{ color: '#347BA7' }}>
            Locação de veículos para motoristas profissionais
          </p>
          <div className="text-xs text-muted-foreground space-x-3">
            <a href="#" className="hover:underline transition-colors" style={{ color: '#6AA98E' }}>Termos de Uso</a>
            <span>•</span>
            <a href="#" className="hover:underline transition-colors" style={{ color: '#6AA98E' }}>Política de Privacidade</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;