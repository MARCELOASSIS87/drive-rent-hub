import { useState } from "react";
import { CarCard } from "@/components/CarCard";
import { CarFilters } from "@/components/CarFilters";
import { mockCars } from "@/data/mockCars";
import { Car } from "@/types/car";

const Dashboard = () => {
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);

  const handleFilterChange = (filters: { brand: string; model: string; year: string }) => {
    let filtered = mockCars;

    if (filters.brand) {
      filtered = filtered.filter(car => car.brand.toLowerCase().includes(filters.brand.toLowerCase()));
    }
    if (filters.model) {
      filtered = filtered.filter(car => car.model.toLowerCase().includes(filters.model.toLowerCase()));
    }
    if (filters.year) {
      filtered = filtered.filter(car => car.year.toString() === filters.year);
    }

    setFilteredCars(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Carros Disponíveis</h1>
          <p className="text-muted-foreground">Escolha o carro ideal para o seu trabalho</p>
        </div>

        <CarFilters onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum carro encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;