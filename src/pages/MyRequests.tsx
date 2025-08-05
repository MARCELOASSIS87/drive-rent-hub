import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { rentalRequestsAPI } from "@/services/api";
import { RentalRequest } from "@/types/backend";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const MyRequests = () => {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadRequests = useCallback(async () => {
    try {
      const response = await rentalRequestsAPI.listMine();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Minhas Solicitações</h1>
        <p className="text-muted-foreground">Acompanhe suas solicitações de aluguel.</p>
      </div>
      {requests.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma solicitação encontrada.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Veículo</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.marca} {req.modelo} ({req.placa})</TableCell>
                <TableCell>{formatDate(req.data_inicio)} - {formatDate(req.data_fim)}</TableCell>
                <TableCell className="capitalize">{req.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MyRequests;