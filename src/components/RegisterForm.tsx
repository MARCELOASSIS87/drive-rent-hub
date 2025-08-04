import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Car, User, Mail, Lock, Phone, MapPin, Calendar, Upload, FileText, CreditCard } from "lucide-react";

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Dados pessoais
  const [personalData, setPersonalData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  // Endereço
  const [address, setAddress] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  // Documentos
  const [documents, setDocuments] = useState({
    cnh: null as File | null,
    cpfDocument: null as File | null,
    proofOfAddress: null as File | null,
    selfieWithCnh: null as File | null,
  });

  // Experiência como motorista
  const [driverInfo, setDriverInfo] = useState({
    hasExperience: false,
    platform: "",
    timeExperience: "",
    vehiclePreference: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleFileUpload = (field: keyof typeof documents) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments(prev => ({
        ...prev,
        [field]: e.target.files![0]
      }));
    }
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      toast({
        title: "Erro",
        description: "Você deve aceitar os termos de uso para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simular cadastro
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Seus documentos serão analisados em até 24 horas.",
      });
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome Completo*</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              placeholder="Seu nome completo"
              value={personalData.fullName}
              onChange={(e) => setPersonalData(prev => ({ ...prev, fullName: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail*</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={personalData.email}
              onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone*</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              placeholder="(11) 99999-9999"
              value={personalData.phone}
              onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF*</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={personalData.cpf}
              onChange={(e) => setPersonalData(prev => ({ ...prev, cpf: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Data de Nascimento*</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="birthDate"
              type="date"
              value={personalData.birthDate}
              onChange={(e) => setPersonalData(prev => ({ ...prev, birthDate: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha*</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={personalData.password}
              onChange={(e) => setPersonalData(prev => ({ ...prev, password: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Senha*</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={personalData.confirmPassword}
              onChange={(e) => setPersonalData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cep">CEP*</Label>
          <Input
            id="cep"
            placeholder="00000-000"
            value={address.cep}
            onChange={(e) => setAddress(prev => ({ ...prev, cep: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado*</Label>
          <Select value={address.state} onValueChange={(value) => setAddress(prev => ({ ...prev, state: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SP">São Paulo</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
              <SelectItem value="MG">Minas Gerais</SelectItem>
              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
              {/* Adicionar outros estados */}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="street">Rua/Avenida*</Label>
          <Input
            id="street"
            placeholder="Nome da rua"
            value={address.street}
            onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Número*</Label>
          <Input
            id="number"
            placeholder="123"
            value={address.number}
            onChange={(e) => setAddress(prev => ({ ...prev, number: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            placeholder="Apto, casa, etc."
            value={address.complement}
            onChange={(e) => setAddress(prev => ({ ...prev, complement: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro*</Label>
          <Input
            id="neighborhood"
            placeholder="Nome do bairro"
            value={address.neighborhood}
            onChange={(e) => setAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade*</Label>
          <Input
            id="city"
            placeholder="Nome da cidade"
            value={address.city}
            onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Faça upload dos documentos necessários. Certifique-se de que estejam legíveis e dentro da validade.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>CNH (Frente e Verso)*</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload('cnh')}
              className="hidden"
              id="cnh-upload"
            />
            <label htmlFor="cnh-upload" className="cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {documents.cnh ? documents.cnh.name : "Clique para fazer upload"}
              </p>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>RG ou CPF*</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload('cpfDocument')}
              className="hidden"
              id="cpf-upload"
            />
            <label htmlFor="cpf-upload" className="cursor-pointer">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {documents.cpfDocument ? documents.cpfDocument.name : "Clique para fazer upload"}
              </p>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Comprovante de Residência*</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload('proofOfAddress')}
              className="hidden"
              id="address-upload"
            />
            <label htmlFor="address-upload" className="cursor-pointer">
              <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {documents.proofOfAddress ? documents.proofOfAddress.name : "Clique para fazer upload"}
              </p>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Selfie com CNH*</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload('selfieWithCnh')}
              className="hidden"
              id="selfie-upload"
            />
            <label htmlFor="selfie-upload" className="cursor-pointer">
              <User className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {documents.selfieWithCnh ? documents.selfieWithCnh.name : "Clique para fazer upload"}
              </p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasExperience"
            checked={driverInfo.hasExperience}
            onCheckedChange={(checked) => setDriverInfo(prev => ({ ...prev, hasExperience: checked as boolean }))}
          />
          <Label htmlFor="hasExperience">Já trabalho como motorista de aplicativo</Label>
        </div>

        {driverInfo.hasExperience && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
            <div className="space-y-2">
              <Label>Plataforma Principal</Label>
              <Select value={driverInfo.platform} onValueChange={(value) => setDriverInfo(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uber">Uber</SelectItem>
                  <SelectItem value="99">99</SelectItem>
                  <SelectItem value="cabify">Cabify</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tempo de Experiência</Label>
              <Select value={driverInfo.timeExperience} onValueChange={(value) => setDriverInfo(prev => ({ ...prev, timeExperience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menos-6m">Menos de 6 meses</SelectItem>
                  <SelectItem value="6m-1a">6 meses a 1 ano</SelectItem>
                  <SelectItem value="1a-3a">1 a 3 anos</SelectItem>
                  <SelectItem value="mais-3a">Mais de 3 anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Preferência de Veículo</Label>
          <Select value={driverInfo.vehiclePreference} onValueChange={(value) => setDriverInfo(prev => ({ ...prev, vehiclePreference: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de veículo preferido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hatch">Hatch (Econômico)</SelectItem>
              <SelectItem value="sedan">Sedan (Conforto)</SelectItem>
              <SelectItem value="suv">SUV (Premium)</SelectItem>
              <SelectItem value="sem-preferencia">Sem preferência</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm leading-relaxed">
            Aceito os{" "}
            <Link to="/terms" className="text-primary underline">
              Termos de Uso
            </Link>
            {" "}e a{" "}
            <Link to="/privacy" className="text-primary underline">
              Política de Privacidade
            </Link>
            {" "}da RentCar Pro
          </Label>
        </div>
      </div>
    </div>
  );

  const stepTitles = [
    "Dados Pessoais",
    "Endereço",
    "Documentos", 
    "Experiência"
  ];

  return (
    <div className="min-h-screen p-4" style={{ background: 'var(--gradient-hero)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 mb-4">
            <Car className="h-6 w-6" />
            <span className="font-semibold">RentCar Pro</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Cadastro de Motorista</h1>
          <p className="text-muted-foreground">Preencha seus dados para começar a alugar</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step > index + 1 ? 'bg-success text-success-foreground' : 
                    step === index + 1 ? 'bg-primary text-primary-foreground' : 
                    'bg-muted text-muted-foreground'}`}>
                  {index + 1}
                </div>
                <span className="text-xs mt-1 text-center">{title}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-lg border-0" style={{ boxShadow: 'var(--shadow-card)' }}>
          <CardHeader>
            <CardTitle>Etapa {step}: {stepTitles[step - 1]}</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={step === 1}
              >
                Voltar
              </Button>

              {step < 4 ? (
                <Button onClick={handleNextStep}>
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!termsAccepted || isLoading}
                >
                  {isLoading ? "Finalizando..." : "Finalizar Cadastro"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/" className="text-primary font-medium hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;