import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Vehicle } from "@/types/backend";

interface CarCardProps {
  car: Vehicle;
}

export const CarCard = ({ car }: CarCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponível":
        return "bg-green-100 text-green-800";
      case "em uso":
        return "bg-blue-100 text-blue-800";
      case "manutenção":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate daily rate (mock for now since backend doesn't have this field)
  const dailyRate = Math.floor(Math.random() * 200) + 100;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <img
          src={car.foto_principal_url || "/placeholder.svg"}
          alt={`${car.marca} ${car.modelo}`}
          className="w-full h-48 object-cover rounded-lg"
        />
      </CardHeader>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{car.marca} {car.modelo}</CardTitle>
            <CardDescription>{car.ano}</CardDescription>
          </div>
          <Badge className={getStatusColor(car.status)}>
            {car.status === 'disponível' ? 'Disponível' : 
             car.status === 'em uso' ? 'Em uso' : 'Manutenção'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Placa:</span>
            <span className="font-medium">{car.placa}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cor:</span>
            <span className="font-medium">{car.cor}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-primary">R$ {dailyRate}/dia</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/rental-request/${car.id}`} className="w-full">
          <Button 
            className="w-full" 
            disabled={car.status !== 'disponível'}
          >
            {car.status === 'disponível' ? 'Solicitar Aluguel' : 'Indisponível'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};