import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";

interface CarFiltersProps {
  onFilterChange: (filters: { brand: string; model: string; year: string }) => void;
}

export const CarFilters = ({ onFilterChange }: CarFiltersProps) => {
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    year: ""
  });

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { brand: "", model: "", year: "" };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = filters.brand || filters.model || filters.year;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              placeholder="Ex: Toyota"
              value={filters.brand}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              placeholder="Ex: Corolla"
              value={filters.model}
              onChange={(e) => handleFilterChange("model", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Ano</Label>
            <Input
              id="year"
              placeholder="Ex: 2022"
              type="number"
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};