/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, Download, Edit, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contractsAPI, api } from "@/services/api";
import { Contract } from "@/types/backend";

const Contratos = () => {
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [contractHtml, setContractHtml] = useState<string>("");
  const [loadingHtml, setLoadingHtml] = useState(false);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        setLoading(true);
        const response = await contractsAPI.list();
        setContracts(response.data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar contratos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    void loadContracts();
  }, [toast]);

  const filtered = statusFilter === "all"
    ? contracts
    : contracts.filter(c => c.status === statusFilter);

  const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-BR");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'assinado': return 'default';
      case 'pronto_para_assinatura': return 'secondary';
      case 'pendente_admin': return 'destructive';
      case 'pendente_motorista': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aguardando': return 'Aguardando';
      case 'pendente_motorista': return 'Pendente Motorista';
      case 'pendente_admin': return 'Pendente Admin';
      case 'pronto_para_assinatura': return 'Pronto para Assinatura';
      case 'assinado': return 'Assinado';
      default: return status;
    }
  };
  async function handlePreview(contratoId: number, revisaoId: number) {
    try {
      setLoadingPreview(true);
      const { data } = await contractsAPI.previewRevision(contratoId, revisaoId);
      if (!data?.ok) throw new Error("Resposta inválida do preview");
      setPreviewHtml(data.html || "");
      setPreviewOpen(true);
    } catch (err: unknown) {
      console.error("[preview] erro:", err);
      toast({
        title: "Erro ao gerar pré-visualização",
        variant: "destructive",
      });
    } finally {
      setLoadingPreview(false);
    }
  }
  const handleProposeRevision = async (contract: Contract) => {
    // Implementar lógica similar ao Solicitacoes.tsx
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Use a página de Solicitações para gerenciar negociações",
    });
  };
  async function handlePreviewPending(contractId: number) {
    try {
      setLoadingPreview(true);
      const revisionsResponse = await contractsAPI.listRevisions(contractId);
      const pendingRevision = revisionsResponse.data.find((r: any) => r.status === 'pendente');

      if (!pendingRevision) {
        toast({
          title: "Sem revisão pendente",
          description: "Não há proposta de alteração para este contrato.",
          variant: "destructive",
        });
        return;
      }

      // reaproveita seu handler existente
      await handlePreview(contractId, pendingRevision.id);
    } catch (err) {
      console.error("[previewPending] erro:", err);
      toast({
        title: "Erro ao gerar pré-visualização",
        variant: "destructive",
      });
    } finally {
      setLoadingPreview(false);
    }
  }

  const handleRevisionAction = async (contractId: number, action: 'accept' | 'reject') => {
    try {
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

      // Recarregar contratos
      const response = await contractsAPI.list();
      setContracts(response.data);
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao ${action === 'accept' ? 'aceitar' : 'rejeitar'} revisão`,
        variant: "destructive",
      });
    }
  };

  const handleFinalizeContract = async (contractId: number) => {
  try {
    await contractsAPI.finalize(contractId);
    toast({ title: "Sucesso", description: "Contrato pronto para assinatura" });
    const response = await contractsAPI.list();
    setContracts(response.data);
  } catch {
    toast({ title: "Erro", description: "Erro ao finalizar contrato", variant: "destructive" });
  }
};


  const openContract = async (contract: Contract) => {
    try {
      setLoadingHtml(true);
      const response = await contractsAPI.getById(contract.id);
      setContractHtml(response.data);
      setSelectedContract(contract);
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

  const closeContract = () => {
    setSelectedContract(null);
    setContractHtml("");
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await contractsAPI.downloadPdf(id);
      const url = window.URL.createObjectURL(response.data);
      const element = document.createElement("a");
      element.href = url;
      element.download = `contrato-${id}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch {
      toast({
        title: "Erro ao baixar PDF",
        variant: "destructive",
      });
    }
  };

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
        <h1 className="text-3xl font-bold text-foreground mb-2">Contratos</h1>
        <p className="text-muted-foreground">Gerencie os contratos de locação</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Contratos</CardTitle>
            <CardDescription>Lista de contratos cadastrados</CardDescription>
          </div>
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="pendente_motorista">Pendente Motorista</SelectItem>
                <SelectItem value="pendente_admin">Pendente Admin</SelectItem>
                <SelectItem value="pronto_para_assinatura">Pronto para Assinatura</SelectItem>
                <SelectItem value="assinado">Assinado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum contrato encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.motorista_nome}</TableCell>
                    <TableCell>{contract.veiculo_marca} {contract.veiculo_modelo}</TableCell>
                    <TableCell>{formatDate(contract.data_inicio)} - {formatDate(contract.data_fim)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(contract.status)}>
                        {getStatusLabel(contract.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => openContract(contract)}>
                          <FileText className="h-4 w-4" />
                          Ver
                        </Button>
                        {(contract.status === 'aguardando' || contract.status === 'pendente_motorista') && (
                          <Button size="sm" variant="secondary" onClick={() => handleProposeRevision(contract)}>
                            <Edit className="h-4 w-4" />
                            Propor Alteração
                          </Button>
                        )}
                        {contract.status === 'pendente_admin' && (
                          <>
                            <Button size="sm" variant="default" onClick={() => handleRevisionAction(contract.id, 'accept')}>
                              <Check className="h-4 w-4" />
                              Aceitar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRevisionAction(contract.id, 'reject')}>
                              <X className="h-4 w-4" />
                              Rejeitar
                            </Button>
                            <Button
                              onClick={() => handlePreviewPending(contract.id)}
                              disabled={loadingPreview}
                              variant="outline"
                            >
                              {loadingPreview ? "Gerando..." : "Pré-visualizar"}
                            </Button>


                          </>
                        )}
                        {(contract.status === 'aguardando' || contract.status === 'pendente_motorista') && (
                          <Button size="sm" variant="default" onClick={() => handleFinalizeContract(contract.id)}>
                            Finalizar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedContract} onOpenChange={closeContract}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          Contratos
          <DialogHeader>
            <DialogTitle>Contrato #{selectedContract?.id}</DialogTitle>
            <DialogDescription>Detalhes do contrato</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {loadingHtml ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contractHtml }} />
            )}
          </div>
          {selectedContract && (
            <Button variant="outline" onClick={() => handleDownload(selectedContract.id)} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
          )}
        </DialogContent>
      </Dialog>
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setPreviewOpen(false)}
          />
          {/* content */}
          <div className="relative z-10 bg-white w-[95vw] max-w-4xl max-h-[85vh] rounded-xl shadow-xl border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h2 className="font-semibold text-base">Pré-visualização do contrato</h2>
              <button
                className="px-2 py-1 text-sm border rounded-md hover:bg-gray-50"
                onClick={() => setPreviewOpen(false)}
              >
                Fechar
              </button>
            </div>

            <div className="p-4 overflow-auto" style={{ maxHeight: "70vh" }}>
              {previewHtml
                ? <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                : <p className="text-sm text-gray-500">Sem conteúdo para pré-visualizar.</p>}
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t bg-gray-50">
              <button
                className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-100"
                onClick={() => setPreviewOpen(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Contratos;
