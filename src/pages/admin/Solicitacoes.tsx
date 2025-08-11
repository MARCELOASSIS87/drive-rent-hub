import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, CreditCard, Edit, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { rentalRequestsAPI, gerarContratoComFallback, contractsAPI } from "@/services/api";
import { RentalRequest } from "@/types/backend";

const Solicitacoes = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [contracts, setContracts] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState(true);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<RentalRequest | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [showProposeDialog, setShowProposeDialog] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [contratoGerado, setContratoGerado] = useState<string>("");
  const [paymentData, setPaymentData] = useState({
    banco: "",
    agencia: "",
    conta: "",
    chave_pix: "",
    endereco_retirada: "",
    endereco_devolucao: "",
  });
  const [proposeData, setProposeData] = useState({
    banco: "",
    agencia: "",
    conta: "",
    chave_pix: "",
    endereco_retirada: "",
    endereco_devolucao: "",
  });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await rentalRequestsAPI.list();
      const requestsData = response.data;
      setRequests(requestsData);
      
      // Load contracts for approved requests
      const contractsData: { [key: number]: any } = {};
      for (const request of requestsData) {
        if (request.status === 'aprovado') {
          try {
            const contractResponse = await contractsAPI.getContractByAluguel(request.id);
            contractsData[request.id] = contractResponse.data;
          } catch (error) {
            // Contract not found for this request - that's ok
          }
        }
      }
      setContracts(contractsData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar solicitações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const handleApprove = async (solicitacao: RentalRequest) => {
    try {
      await rentalRequestsAPI.updateStatus(solicitacao.id, 'aprovado');
      toast({
        title: "Sucesso",
        description: "Solicitação aprovada",
      });
      await loadRequests();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao aprovar solicitação",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedSolicitacao || !motivoRecusa.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o motivo da recusa",
        variant: "destructive",
      });
      return;
    }

    try {
      await rentalRequestsAPI.updateStatus(selectedSolicitacao.id, 'recusado', motivoRecusa);
      toast({
        title: "Sucesso",
        description: "Solicitação recusada",
      });
      setShowRejectDialog(false);
      setSelectedSolicitacao(null);
      setMotivoRecusa("");
      await loadRequests();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao recusar solicitação",
        variant: "destructive",
      });
    }
  };

  const openRejectDialog = (solicitacao: RentalRequest) => {
    setSelectedSolicitacao(solicitacao);
    setShowRejectDialog(true);
  };

  const openGenerateDialog = (solicitacao: RentalRequest) => {
    setSelectedSolicitacao(solicitacao);
    setShowGenerateDialog(true);
  };

  const handleGenerateContract = async () => {
    if (!selectedSolicitacao || !paymentData.banco.trim() || !paymentData.agencia.trim() || !paymentData.conta.trim() || !paymentData.chave_pix.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await gerarContratoComFallback({
        aluguel_id: selectedSolicitacao.id,
        banco: paymentData.banco,
        agencia: paymentData.agencia,
        conta: paymentData.conta,
        chave_pix: paymentData.chave_pix,
        endereco_retirada: paymentData.endereco_retirada || undefined,
        endereco_devolucao: paymentData.endereco_devolucao || undefined,
      });
      
      toast({
        title: "Sucesso",
        description: "Contrato gerado com sucesso",
      });
      
      setShowGenerateDialog(false);
      setPaymentData({
        banco: "",
        agencia: "",
        conta: "",
        chave_pix: "",
        endereco_retirada: "",
        endereco_devolucao: "",
      });
      setSelectedSolicitacao(null);
      await loadRequests();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar contrato",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "aprovado":
        return <Badge variant="default">Aprovado</Badge>;
      case "recusado":
        return <Badge variant="destructive">Recusado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredRequests = requests.filter(req => req.status === 'pendente');

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Solicitações de Aluguel</h1>
        <p className="text-muted-foreground">Gerencie as solicitações de aluguel de veículos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações Pendentes</CardTitle>
          <CardDescription>
            {filteredRequests.length} solicitação{filteredRequests.length !== 1 ? 'ões' : ''} aguardando análise
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma solicitação pendente</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((solicitacao) => {
                  const contract = contracts[solicitacao.id];
                  return (
                    <TableRow key={solicitacao.id}>
                      <TableCell className="font-medium">{solicitacao.motorista_nome}</TableCell>
                      <TableCell>{solicitacao.marca} {solicitacao.modelo}</TableCell>
                      <TableCell>{formatDate(solicitacao.data_inicio)} - {formatDate(solicitacao.data_fim)}</TableCell>
                      <TableCell>{formatCurrency(solicitacao.valor_total)}</TableCell>
                      <TableCell>{getStatusBadge(solicitacao.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(solicitacao)}
                            disabled={solicitacao.status !== "pendente"}
                          >
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openRejectDialog(solicitacao)}
                            disabled={solicitacao.status !== "pendente"}
                          >
                            Recusar
                          </Button>
                          {solicitacao.status === "aprovado" && !contract && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openGenerateDialog(solicitacao)}
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              Gerar Contrato
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recusar Solicitação</DialogTitle>
            <DialogDescription>
              Informe o motivo da recusa para {selectedSolicitacao?.motorista_nome}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo da recusa</Label>
              <Textarea
                id="reason"
                placeholder="Descreva o motivo da recusa..."
                value={motivoRecusa}
                onChange={(e) => setMotivoRecusa(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirmar Recusa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Contract Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Contrato</DialogTitle>
            <DialogDescription>Preencha os dados para pagamento e endereços</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="banco">Banco *</Label>
              <Input 
                id="banco" 
                value={paymentData.banco} 
                onChange={(e) => setPaymentData({ ...paymentData, banco: e.target.value })} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agencia">Agência *</Label>
              <Input 
                id="agencia" 
                value={paymentData.agencia} 
                onChange={(e) => setPaymentData({ ...paymentData, agencia: e.target.value })} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="conta">Conta *</Label>
              <Input 
                id="conta" 
                value={paymentData.conta} 
                onChange={(e) => setPaymentData({ ...paymentData, conta: e.target.value })} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chave_pix">Chave PIX *</Label>
              <Input 
                id="chave_pix" 
                value={paymentData.chave_pix} 
                onChange={(e) => setPaymentData({ ...paymentData, chave_pix: e.target.value })} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endereco_retirada">Endereço de Retirada</Label>
              <Input 
                id="endereco_retirada" 
                value={paymentData.endereco_retirada} 
                onChange={(e) => setPaymentData({ ...paymentData, endereco_retirada: e.target.value })}
                placeholder="Recomendado - informe o endereço para constar no contrato"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endereco_devolucao">Endereço de Devolução</Label>
              <Input 
                id="endereco_devolucao" 
                value={paymentData.endereco_devolucao} 
                onChange={(e) => setPaymentData({ ...paymentData, endereco_devolucao: e.target.value })}
                placeholder="Recomendado - informe o endereço para constar no contrato"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGenerateContract}>
              Gerar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Solicitacoes;