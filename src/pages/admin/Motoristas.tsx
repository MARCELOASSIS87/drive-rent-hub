import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import { driversAPI } from "@/services/api";
import { Driver } from "@/types/backend";

const Motoristas = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const response = await driversAPI.list("em_analise");
      setDrivers(response.data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar motoristas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (driver: Driver) => {
    try {
      setActionLoading(driver.id);
      await driversAPI.updateStatus(driver.id, "aprovado");
      
      toast({
        title: "Motorista aprovado",
        description: `${driver.nome} foi aprovado com sucesso`,
      });
      
      loadDrivers();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao aprovar motorista",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedDriver || !rejectReason.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o motivo da recusa",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(selectedDriver.id);
      await driversAPI.updateStatus(selectedDriver.id, "recusado");
      
      toast({
        title: "Motorista recusado",
        description: `${selectedDriver.nome} foi recusado`,
      });
      
      setShowRejectDialog(false);
      setSelectedDriver(null);
      setRejectReason("");
      loadDrivers();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao recusar motorista",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectDialog = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowRejectDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Motoristas</h1>
        <p className="text-muted-foreground">
          Aprove ou recuse solicitações de cadastro de motoristas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Motoristas Pendentes de Aprovação</CardTitle>
          <CardDescription>
            {drivers.length} motorista{drivers.length !== 1 ? 's' : ''} aguardando análise
          </CardDescription>
        </CardHeader>
        <CardContent>
          {drivers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum motorista pendente de aprovação</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>CNH</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.nome}</TableCell>
                    <TableCell>{driver.email}</TableCell>
                    <TableCell>{driver.cpf}</TableCell>
                    <TableCell>{driver.cnh_numero}</TableCell>
                    <TableCell>{formatDate(driver.data_nascimento)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Em Análise</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(driver)}
                          disabled={actionLoading === driver.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {actionLoading === driver.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectDialog(driver)}
                          disabled={actionLoading === driver.id}
                        >
                          <XCircle className="h-4 w-4" />
                          Recusar
                        </Button>
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
            <DialogTitle>Recusar Motorista</DialogTitle>
            <DialogDescription>
              Informe o motivo da recusa para {selectedDriver?.nome}
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
              disabled={!rejectReason.trim() || actionLoading === selectedDriver?.id}
            >
              {actionLoading === selectedDriver?.id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirmar Recusa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Motoristas;