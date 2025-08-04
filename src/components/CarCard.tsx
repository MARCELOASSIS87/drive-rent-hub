import { Car } from "@/types/car";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  const navigate = useNavigate();

  const handleRentRequest = () => {
    navigate(`/rental-request/${car.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-48 object-cover"
          />
          <Badge
            variant={car.status === "available" ? "default" : "secondary"}
            className="absolute top-2 right-2"
          >
            {car.status === "available" ? "Disponível" : "Indisponível"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground">
            {car.brand} {car.model}
          </h3>
          <p className="text-sm text-muted-foreground">Ano: {car.year}</p>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Combustível:</span>
            <span className="text-foreground">{car.fuel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Câmbio:</span>
            <span className="text-foreground">{car.transmission}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Diária:</span>
            <span className="text-foreground">R$ {car.dailyRate}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Recursos:</p>
          <div className="flex flex-wrap gap-1">
            {car.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleRentRequest}
          className="w-full"
          disabled={car.status !== "available"}
        >
          Solicitar Aluguel
        </Button>
      </CardFooter>
    </Card>
  );
};