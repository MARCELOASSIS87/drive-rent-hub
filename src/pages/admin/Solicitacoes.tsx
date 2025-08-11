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
        // Incluir dados pessoais do motorista da solicitação
        nacionalidade: selectedSolicitacao.nacionalidade,
        estado_civil: selectedSolicitacao.estado_civil,
        profissao: selectedSolicitacao.profissao,
        rg: selectedSolicitacao.rg,
        endereco: selectedSolicitacao.endereco,
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

  // Função para abrir preview do contrato
  const openContractPreview = async (contract: any) => {
    try {
      const response = await contractsAPI.getById(contract.id);
      setContratoGerado(response.data);
      setSelectedContract(contract);
      setShowContractDialog(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar contrato",
        variant: "destructive",
      });
    }
  };

  // Função para abrir modal de proposta de alteração
  const openProposeDialog = async (contract: any) => {
    try {
      // Buscar dados atuais do contrato para pré-preencher
      const response = await contractsAPI.getContractJson(contract.id);
      const contractData = response.data;
      
      setProposeData({
        banco: contractData.banco || "",
        agencia: contractData.agencia || "",
        conta: contractData.conta || "",
        chave_pix: contractData.chave_pix || "",
        endereco_retirada: contractData.endereco_retirada || "",
        endereco_devolucao: contractData.endereco_devolucao || "",
      });
      
      setSelectedContract(contract);
      setShowProposeDialog(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do contrato",
        variant: "destructive",
      });
    }
  };

  // Função para enviar proposta de alteração
  const handleProposeRevision = async () => {
    if (!selectedContract || !proposeData.banco.trim() || !proposeData.agencia.trim() || !proposeData.conta.trim() || !proposeData.chave_pix.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await contractsAPI.proposeRevision(selectedContract.id, {
        tipo: 'admin',
        banco: proposeData.banco,
        agencia: proposeData.agencia,
        conta: proposeData.conta,
        chave_pix: proposeData.chave_pix,
        endereco_retirada: proposeData.endereco_retirada || undefined,
        endereco_devolucao: proposeData.endereco_devolucao || undefined,
      });

      toast({
        title: "Sucesso",
        description: "Proposta de alteração enviada",
      });

      setShowProposeDialog(false);
      setSelectedContract(null);
      setProposeData({
        banco: "",
        agencia: "",
        conta: "",
        chave_pix: "",
        endereco_retirada: "",
        endereco_devolucao: "",
      });
      await loadRequests();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar proposta",
        variant: "destructive",
      });
    }
  };

  // Função para aceitar/rejeitar revisão
  const handleRevisionAction = async (contractId: number, action: 'accept' | 'reject') => {
    try {
      // Buscar revisões pendentes
      const revisionsResponse = await contractsAPI.listRevisions(contractId);
      const pendingRevision = revisionsResponse.data.find((r: any) => r.status === 'pendente');
      
      if (!pendingRevision) {
        toast({
          title: "Erro",
          description: "Nenhuma revisão pendente encontrada",
          variant: "destructive",
        });
        return;
      }

      if (action === 'accept') {
        await contractsAPI.acceptRevision(contractId, pendingRevision.id);
        toast({
          title: "Sucesso",
          description: "Revisão aceita",
        });
      } else {
        await contractsAPI.rejectRevision(contractId, pendingRevision.id);
        toast({
          title: "Sucesso",
          description: "Revisão rejeitada",
        });
      }

      await loadRequests();
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao ${action === 'accept' ? 'aceitar' : 'rejeitar'} revisão`,
        variant: "destructive",
      });
    }
  };

  // Função para finalizar negociação
  const handleFinalizeNegotiation = async (contractId: number) => {
    try {
      await contractsAPI.finalizeNegotiation(contractId);
      toast({
        title: "Sucesso",
        description: "Negociação finalizada - contrato pronto para assinatura",
      });
      await loadRequests();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao finalizar negociação",
        variant: "destructive",
      });
    }
  };

  const filteredRequests = requests.filter(req => req.status === 'pendente' || req.status === 'aprovado');

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
          <CardTitle>Solicitações e Contratos</CardTitle>
          <CardDescription>
            {requests.filter(r => r.status === 'pendente').length} pendente{requests.filter(r => r.status === 'pendente').length !== 1 ? 's' : ''} • {requests.filter(r => r.status === 'aprovado').length} aprovada{requests.filter(r => r.status === 'aprovado').length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
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
                          {solicitacao.status === "aprovado" && contract && (
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openContractPreview(contract)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Ver Contrato
                              </Button>
                              {(contract.status === 'aguardando' || contract.status === 'pendente_motorista') && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => openProposeDialog(contract)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Propor Alteração
                                </Button>
                              )}
                              {contract.status === 'pendente_admin' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleRevisionAction(contract.id, 'accept')}
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Aceitar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRevisionAction(contract.id, 'reject')}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Rejeitar
                                  </Button>
                                </>
                              )}
                              {(contract.status === 'aguardando' || contract.status === 'pendente_motorista') && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleFinalizeNegotiation(contract.id)}
                                >
                                  Finalizar Negociação
                                </Button>
                              )}
                            </div>
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

      {/* Contract Preview Dialog */}
      <Dialog open={showContractDialog} onOpenChange={setShowContractDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contrato #{selectedContract?.id}</DialogTitle>
            <DialogDescription>Visualização do contrato</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contratoGerado }} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Propose Revision Dialog */}
      <Dialog open={showProposeDialog} onOpenChange={setShowProposeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propor Alteração no Contrato</DialogTitle>
            <DialogDescription>Altere os dados de pagamento e endereços</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="propose_banco">Banco *</Label>
              <Input 
                id="propose_banco" 
                value={proposeData.banco} 
                onChange={(e) => setProposeData({ ...proposeData, banco: e.target.value })} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="propose_agencia">Agência *</Label>
              <Input 
                id="propose_agencia" 
                value={proposeData.agencia} 
                onChange={(e) => setProposeData({ ...proposeData, agencia: e.target.value })} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="propose_conta">Conta *</Label>
              <Input 
                id="propose_conta" 
                value={proposeData.conta} 
                onChange={(e) => setProposeData({ ...proposeData, conta: e.target.value })} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="propose_chave_pix">Chave PIX *</Label>
              <Input 
                id="propose_chave_pix" 
                value={proposeData.chave_pix} 
                onChange={(e) => setProposeData({ ...proposeData, chave_pix: e.target.value })} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="propose_endereco_retirada">Endereço de Retirada</Label>
              <Input 
                id="propose_endereco_retirada" 
                value={proposeData.endereco_retirada} 
                onChange={(e) => setProposeData({ ...proposeData, endereco_retirada: e.target.value })}
                placeholder="Endereço de retirada do veículo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="propose_endereco_devolucao">Endereço de Devolução</Label>
              <Input 
                id="propose_endereco_devolucao" 
                value={proposeData.endereco_devolucao} 
                onChange={(e) => setProposeData({ ...proposeData, endereco_devolucao: e.target.value })}
                placeholder="Endereço de devolução do veículo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProposeDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleProposeRevision}>
              Enviar Proposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Solicitacoes;