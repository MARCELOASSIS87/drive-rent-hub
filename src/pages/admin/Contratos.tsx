import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contractsAPI, api } from "@/services/api";
import { Contract } from "@/types/backend";

const Contratos = () => {
  const { toast } = useToast();
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
                      <Badge variant={contract.status === 'assinado' ? 'default' : 'secondary'}>
                        {contract.status === 'assinado' ? 'Assinado' : 'Aguardando'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => openContract(contract)}>
                        <FileText className="h-4 w-4" />
                        Ver
                      </Button>
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
    </div>
  );
};

export default Contratos;
