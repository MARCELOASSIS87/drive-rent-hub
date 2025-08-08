import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, ArrowLeft, CheckCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContratoAluguel } from '@/types/contrato';
import { contractsAPI } from '@/services/api';



// Mock data - em produção seria puxado da API
const mockContrato: ContratoAluguel = {
  id: 1,
  motorista: {
    nome: "João Silva Santos",
    cpf: "123.456.789-10",
    email: "joao.silva@email.com"
  },
  veiculo: {
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2023,
    placa: "ABC-1234"
  },
  periodo: {
    dataInicio: "2024-08-10",
    dataFim: "2024-08-15"
  },
  valorTotal: 450.00,
  status: 'pendente_assinatura'
};



const ContratoDigital = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [contrato, setContrato] = useState<ContratoAluguel>(mockContrato);
  const [showAssinarModal, setShowAssinarModal] = useState(false);
  const [isAssining, setIsAssining] = useState(false);
  const [contractHtml, setContractHtml] = useState<string>('');

  useEffect(() => {
    const fetchContrato = async () => {
      try {
        const html = await contractsAPI.getById(Number(id));
        setContractHtml(html);
      } catch (error) {
        toast({
          title: 'Erro ao carregar contrato',
          variant: 'destructive',
        });
      }
    };
    if (id) {
      void fetchContrato();
    }
  }, [id, toast]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAssinarContrato = async () => {
    setIsAssining(true);
    try {
      await contractsAPI.sign(Number(id));
      setContrato(prev => ({
        ...prev,
        status: 'assinado',
        dataAssinatura: new Date().toISOString(),
      }));
      setShowAssinarModal(false);
      toast({
        title: "Contrato assinado com sucesso!",
        description: "Seu contrato foi assinado digitalmente via Gov.br",
        variant: "default",
      });
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao assinar contrato";
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAssining(false);
    }
  };


  const handleDownloadPDF = () => {
    // Simular download do PDF
    const element = document.createElement('a');
    const file = new Blob(['Contrato de Aluguel - PDF Simulado'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `contrato-aluguel-${contrato.id}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Download iniciado",
      description: "O contrato PDF está sendo baixado",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Contrato de Aluguel – Assinatura</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Badge */}
        <div className="mb-6 flex justify-center">
          <Badge
            variant={contrato.status === 'assinado' ? 'default' : 'secondary'}
            className="text-sm px-4 py-2"
          >
            {contrato.status === 'assinado' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Contrato Assinado
              </>
            ) : (
              'Aguardando Assinatura'
            )}
          </Badge>
        </div>

        {/* Detalhes do Contrato */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalhes do Contrato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dados do Motorista */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Dados do Motorista</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Nome Completo</span>
                  <p className="font-medium">{contrato.motorista.nome}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">CPF</span>
                  <p className="font-medium">{contrato.motorista.cpf}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">E-mail</span>
                  <p className="font-medium">{contrato.motorista.email}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Dados do Veículo */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Dados do Veículo</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Marca</span>
                  <p className="font-medium">{contrato.veiculo.marca}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Modelo</span>
                  <p className="font-medium">{contrato.veiculo.modelo}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Ano</span>
                  <p className="font-medium">{contrato.veiculo.ano}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Placa</span>
                  <p className="font-medium">{contrato.veiculo.placa}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Período e Valor */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <span className="text-sm text-muted-foreground">Data de Início</span>
                <p className="font-medium">{formatDate(contrato.periodo.dataInicio)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Data de Fim</span>
                <p className="font-medium">{formatDate(contrato.periodo.dataFim)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Valor Total</span>
                <p className="font-medium text-lg text-primary">{formatCurrency(contrato.valorTotal)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Texto do Contrato */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Termos e Condições</CardTitle>
          </CardHeader>
          <CardContent>
            {contractHtml ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: contractHtml }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Carregando contrato...</p>
            )}
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {contrato.status === 'pendente_assinatura' ? (
            <Button
              onClick={() => setShowAssinarModal(true)}
              size="lg"
              className="flex items-center gap-2"
            >
              <Shield className="h-5 w-5" />
              Li e aceito, assinar contrato
            </Button>
          ) : (
            <Button
              onClick={handleDownloadPDF}
              size="lg"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download PDF do Contrato
            </Button>
          )}
        </div>

        {contrato.status === 'assinado' && contrato.dataAssinatura && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Contrato assinado em {formatDate(contrato.dataAssinatura)} às{' '}
              {new Date(contrato.dataAssinatura).toLocaleTimeString('pt-BR')}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Assinatura */}
      <Dialog open={showAssinarModal} onOpenChange={setShowAssinarModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Confirmação de Assinatura
            </DialogTitle>
            <DialogDescription>
              Você será redirecionado para o Gov.br para realizar a assinatura digital do contrato.
              Este processo é seguro e utiliza sua identidade digital brasileira.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssinarModal(false)}
              disabled={isAssining}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssinarContrato}
              disabled={isAssining}
              className="flex items-center gap-2"
            >
              {isAssining ? (
                "Assinando..."
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Confirmar Assinatura
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContratoDigital;