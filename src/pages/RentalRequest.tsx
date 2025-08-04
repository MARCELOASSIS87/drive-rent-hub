import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Car } from "lucide-react";
import { mockCars } from "@/data/mockCars";
import { useToast } from "@/hooks/use-toast";

const RentalRequest = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const car = mockCars.find(c => c.id === carId);

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Carro não encontrado</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = calculateDays();
  const totalAmount = totalDays * car.dailyRate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast({
        title: "Erro",
        description: "Preencha as datas de início e fim do aluguel",
        variant: "destructive"
      });
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast({
        title: "Erro",
        description: "A data de fim deve ser posterior à data de início",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simular envio da solicitação
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Solicitação enviada com sucesso!",
      description: "Aguardando aprovação. Você receberá uma notificação em breve.",
      duration: 5000
    });

    setIsSubmitting(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Carro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Dados do Veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {car.brand} {car.model}
                </h3>
                <p className="text-muted-foreground">Ano: {car.year}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Combustível:</span>
                  <p className="font-medium">{car.fuel}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Câmbio:</span>
                  <p className="font-medium">{car.transmission}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor da diária:</span>
                  <p className="font-medium text-lg">R$ {car.dailyRate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default" className="mt-1">Disponível</Badge>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">Recursos:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {car.features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Solicitação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Solicitação de Aluguel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {totalDays > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Período:</span>
                          <span className="font-medium">{totalDays} dia(s)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Valor por dia:</span>
                          <span className="font-medium">R$ {car.dailyRate}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total:</span>
                          <span>R$ {totalAmount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Confirmar Solicitação"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RentalRequest;