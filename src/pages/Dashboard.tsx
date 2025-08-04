import { useState, useEffect } from "react";
import { CarCard } from "@/components/CarCard";
import { CarFilters } from "@/components/CarFilters";
import { vehiclesAPI } from "@/services/api";
import { Vehicle } from "@/types/backend";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehiclesAPI.list();
      const availableVehicles = response.data.filter((vehicle: Vehicle) => 
        vehicle.status === 'disponível' && vehicle.ativo === 1
      );
      setVehicles(availableVehicles);
      setFilteredVehicles(availableVehicles);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar veículos disponíveis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: { brand: string; model: string; year: string }) => {
    let filtered = vehicles;

    if (filters.brand) {
      filtered = filtered.filter(vehicle => 
        vehicle.marca.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }
    if (filters.model) {
      filtered = filtered.filter(vehicle => 
        vehicle.modelo.toLowerCase().includes(filters.model.toLowerCase())
      );
    }
    if (filters.year) {
      filtered = filtered.filter(vehicle => 
        vehicle.ano.toString() === filters.year
      );
    }

    setFilteredVehicles(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Carros Disponíveis</h1>
            <p className="text-muted-foreground">Carregando veículos...</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Carros Disponíveis</h1>
          <p className="text-muted-foreground">Escolha o carro ideal para o seu trabalho</p>
        </div>

        <CarFilters onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredVehicles.map((vehicle) => (
            <CarCard key={vehicle.id} car={vehicle} />
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum carro encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;