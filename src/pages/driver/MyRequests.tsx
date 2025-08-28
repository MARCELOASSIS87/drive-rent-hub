import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, Edit, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { rentalRequestsAPI, contractsAPI } from "@/services/api";
import { RentalRequest } from "@/types/backend";

const MyRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [contracts, setContracts] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState(true);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [contractHtml, setContractHtml] = useState<string>("");
  const [loadingHtml, setLoadingHtml] = useState(false);
  const [proposalData, setProposalData] = useState({
    nacionalidade: "",
    estado_civil: "",
    profissao: "",
    rg: "",
    endereco: ""
  });

  const loadRequests = async () => {
    try {
      const response = await rentalRequestsAPI.listMine();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aprovado":
        return <Badge variant="default">Aprovado</Badge>;
      case "recusado":
        return <Badge variant="destructive">Recusado</Badge>;
      case "pendente":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Em análise</Badge>;
      default:
        return <Badge variant="secondary">Em análise</Badge>;
    }
  };

  const openContractPreview = async (contract: any) => {
    try {
      setLoadingHtml(true);
      const response = await contractsAPI.getById(contract.id);
      setContractHtml(response.data);
      setSelectedContract(contract);
      setShowContractModal(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar contrato",
        variant: "destructive",
      });
    } finally {
      setLoadingHtml(false);
    }
  };

  const openProposeRevision = async (contract: any) => {
    try {
      const response = await contractsAPI.getContractJson(contract.id);
      const motorista = response.data?.dados_json?.motorista || {};
      setProposalData({
        nacionalidade: motorista.nacionalidade || "",
        estado_civil: motorista.estado_civil || "",
        profissao: motorista.profissao || "",
        rg: motorista.rg || "",
        endereco: motorista.endereco || ""
      });
      setSelectedContract(contract);
      setShowProposeModal(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do contrato",
        variant: "destructive",
      });
    }
  };

  const submitProposal = async () => {
    try {
      await contractsAPI.proposeRevision(selectedContract.id, {
        mudancas: {
          'motorista.nacionalidade': proposalData.nacionalidade,
          'motorista.estado_civil': proposalData.estado_civil,
          'motorista.profissao': proposalData.profissao,
          'motorista.rg': proposalData.rg,
          'motorista.endereco': proposalData.endereco
        }
      });
      
      setShowProposeModal(false);
      toast({
        title: "Sucesso",
        description: "Proposta de alteração enviada",
      });
      
      // Refresh contracts
      await loadRequests();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar proposta",
        variant: "destructive",
      });
    }
  };

  const handleRevisionAction = async (contract: any, revisionId: number, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await contractsAPI.acceptRevision(contract.id, revisionId);
        toast({
          title: "Sucesso",
          description: "Proposta aceita",
        });
      } else {
        await contractsAPI.rejectRevision(contract.id, revisionId);
        toast({
          title: "Sucesso",
          description: "Proposta rejeitada",
        });
      }
      
      // Refresh contracts
      await loadRequests();
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao ${action === 'accept' ? 'aceitar' : 'rejeitar'} proposta`,
        variant: "destructive",
      });
    }
  };

  const handleSignContract = async (contract: any) => {
    try {
      await contractsAPI.sign(contract.id);
      toast({
        title: "Sucesso",
        description: "Contrato assinado com sucesso",
      });
      
      // Refresh contracts
      await loadRequests();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao assinar contrato",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Minhas Solicitações</CardTitle>
          <CardDescription>
            Acompanhe o status das suas solicitações de aluguel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const contract = contracts[request.id];
                  return (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.marca} {request.modelo}
                      </TableCell>
                      <TableCell>
                        {formatDate(request.data_inicio)} - {formatDate(request.data_fim)}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {contract && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openContractPreview(contract)}
                              >
                                <FileText className="h-4 w-4" />
                                Ver contrato
                              </Button>
                              
                              {contract.status !== 'assinado' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openProposeRevision(contract)}
                                >
                                  <Edit className="h-4 w-4" />
                                  Propor alteração
                                </Button>
                              )}
                              
                              {contract.status === 'pendente_motorista' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleRevisionAction(contract, contract.pending_revision_id, 'accept')}
                                  >
                                    <Check className="h-4 w-4" />
                                    Aceitar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRevisionAction(contract, contract.pending_revision_id, 'reject')}
                                  >
                                    <X className="h-4 w-4" />
                                    Rejeitar
                                  </Button>
                                </>
                              )}
                              
                              {contract.status === 'pronto_para_assinatura' && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleSignContract(contract)}
                                >
                                  Assinar
                                </Button>
                              )}
                            </>
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

      {/* Contract Preview Modal */}
      <Dialog open={showContractModal} onOpenChange={setShowContractModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Contrato #{selectedContract?.id}</DialogTitle>
            <DialogDescription>Preview do contrato</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {loadingHtml ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contractHtml }} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Propose Revision Modal */}
      <Dialog open={showProposeModal} onOpenChange={setShowProposeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Propor Alteração - Dados Pessoais</DialogTitle>
            <DialogDescription>
              Atualize seus dados pessoais no contrato
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nacionalidade">Nacionalidade</Label>
              <Input
                id="nacionalidade"
                value={proposalData.nacionalidade}
                onChange={(e) => setProposalData({ ...proposalData, nacionalidade: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="estado_civil">Estado Civil</Label>
              <Input
                id="estado_civil"
                value={proposalData.estado_civil}
                onChange={(e) => setProposalData({ ...proposalData, estado_civil: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="profissao">Profissão</Label>
              <Input
                id="profissao"
                value={proposalData.profissao}
                onChange={(e) => setProposalData({ ...proposalData, profissao: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={proposalData.rg}
                onChange={(e) => setProposalData({ ...proposalData, rg: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={proposalData.endereco}
                onChange={(e) => setProposalData({ ...proposalData, endereco: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProposeModal(false)}>
              Cancelar
            </Button>
            <Button onClick={submitProposal}>
              Enviar Proposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyRequests;