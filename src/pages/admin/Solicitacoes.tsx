import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, FileText, Loader2 } from "lucide-react";
import { rentalRequestsAPI } from "@/services/api";
import { RentalRequest } from "@/types/backend";


const Solicitacoes = () => {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const { toast } = useToast();

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await rentalRequestsAPI.list();
      setRequests(response.data);
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: "Erro ao carregar solicitações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleApprove = async (request: RentalRequest) => {
    try {
      setActionLoading(request.id);
      await rentalRequestsAPI.updateStatus(request.id, 'aprovado');
      setRequests(prev => prev.map(req =>
        req.id === request.id
          ? { ...req, status: 'aprovado' as const }
          : req
      ));

      toast({
        title: "Solicitação aprovada",
        description: `Solicitação de ${request.motorista.nome} foi aprovada`,
      });
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: "Erro ao aprovar solicitação",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o motivo da recusa",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(selectedRequest.id);
      await rentalRequestsAPI.updateStatus(selectedRequest.id, 'recusado', rejectReason);
      setRequests(prev => prev.map(req =>
        req.id === selectedRequest.id
          ? { ...req, status: 'recusado' as const }
          : req
      ));
      toast({
        title: "Solicitação recusada",
        description: `Solicitação de ${selectedRequest.motorista_nome} foi recusada`,
      });
      setShowRejectDialog(false);
      setSelectedRequest(null);
      setRejectReason("");
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: "Erro ao recusar solicitação",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectDialog = (request: RentalRequest) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const showContract = (request: RentalRequest) => {
    setSelectedRequest(request);
    setShowContractDialog(true);
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
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "aprovado":
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case "recusado":
        return <Badge className="bg-red-100 text-red-800">Recusado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pendente');
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Solicitações de Aluguel</h1>
        <p className="text-muted-foreground">
          Gerencie as solicitações de aluguel de veículos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações Pendentes</CardTitle>
          <CardDescription>
            {pendingRequests.length} solicitação{pendingRequests.length !== 1 ? 'ões' : ''} aguardando análise
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
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
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.motorista_nome}</p>
                        <p className="text-sm text-muted-foreground">{request.motorista_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.veiculo.marca} {request.veiculo.modelo}</p>
                        <p className="text-sm text-muted-foreground">{request.veiculo.placa}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{formatDate(request.data_inicio)} -</p>
                        <p>{formatDate(request.data_fim)}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(request.valor_total || 0)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {request.status === 'pendente' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(request)}
                              disabled={actionLoading === request.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {actionLoading === request.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openRejectDialog(request)}
                              disabled={actionLoading === request.id}
                            >
                              <XCircle className="h-4 w-4" />
                              Recusar
                            </Button>
                          </>
                        )}
                        {request.status === 'aprovado' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => showContract(request)}
                          >
                            <FileText className="h-4 w-4" />
                            Ver Contrato
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

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recusar Solicitação</DialogTitle>
            <DialogDescription>
              Informe o motivo da recusa para {selectedRequest?.motorista_nome}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo da recusa</Label>
              <Textarea
                id="reason"
                placeholder="Descreva o motivo da recusa..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason("");
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || actionLoading === selectedRequest?.id}
            >
              {actionLoading === selectedRequest?.id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirmar Recusa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Dialog */}
      <Dialog open={showContractDialog} onOpenChange={setShowContractDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contrato Digital</DialogTitle>
            <DialogDescription>
              Contrato de locação de veículo
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">CONTRATO DE LOCAÇÃO DE VEÍCULO</h3>

              <div className="space-y-4">
                <div>
                  <strong>Locatário:</strong> {selectedRequest?.motorista_nome}<br />
                  <strong>E-mail:</strong> {selectedRequest?.motorista_email}
                </div>

                <div>
                  <strong>Veículo:</strong> {selectedRequest?.marca} {selectedRequest?.modelo}<br />
                  <strong>Placa:</strong> {selectedRequest?.placa}
                </div>

                <div>
                  <strong>Período:</strong> {selectedRequest && formatDate(selectedRequest.data_inicio)} até {selectedRequest && formatDate(selectedRequest.data_fim)}<br />
                  <strong>Valor Total:</strong> {selectedRequest && formatCurrency(selectedRequest.valor_total)}
                </div>

                <div className="mt-6 p-4 bg-background rounded border">
                  <p className="text-sm text-muted-foreground">
                    Este é um contrato digital gerado automaticamente.
                    O locatário concorda com os termos e condições de locação
                    estabelecidos pela empresa.
                  </p>
                </div>

                <div className="text-center mt-6">
                  <p className="text-sm font-medium">Status: Aprovado</p>
                  <p className="text-xs text-muted-foreground">
                    Contrato gerado em {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowContractDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Solicitacoes;