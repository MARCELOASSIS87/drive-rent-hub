import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Car, ClipboardCheck, FileClock } from "lucide-react";
import { getOwnerStats, OwnerStats } from "@/services/api";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: number | string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <h2 className="text-3xl font-bold mt-1">{value}</h2>
        </div>
        <Icon className="w-8 h-8 opacity-60" />
      </div>
    </Card>
  );
}

export default function OwnerDashboard() {
  const { data, isLoading, isFetching, refetch } = useQuery<OwnerStats>({
    queryKey: ["ownerStats"],
    queryFn: getOwnerStats,
    staleTime: 30_000,
  });

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel do Proprietário</h1>
          <p className="text-muted-foreground">Visão geral da sua operação</p>
        </div>
        <button
          onClick={() => refetch()}
          className="text-sm px-3 py-2 rounded-md border hover:bg-muted"
          disabled={isFetching}
          title="Atualizar indicadores"
        >
          {isFetching ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      {/* KPIs */}
      {isLoading ? (
        <p className="text-muted-foreground">Carregando indicadores...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={Car}
            label="Veículos alugados"
            value={data?.veiculosAlugados ?? 0}
          />
          <StatCard
            icon={ClipboardCheck}
            label="Aluguéis ativos"
            value={data?.alugueisAtivos ?? 0}
          />
          <StatCard
            icon={FileClock}
            label="Solicitações pendentes"
            value={data?.solicitacoesPendentes ?? 0}
          />
        </div>
      )}
    </div>
  );
}
