import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, MapPin, Fuel, Settings, Loader2 } from "lucide-react";
import { vehiclesAPI } from "@/services/api";
import { Vehicle } from "@/types/backend";

const RentalRequest = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [car, setCar] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (carId) {
      loadCar();
    }
  }, [carId]);

  const loadCar = async () => {
    try {
      setLoading(true);
      const response = await vehiclesAPI.getById(Number(carId));
      setCar(response.data);
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: "Veículo não encontrado",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Carro não encontrado</h2>
            <p className="text-muted-foreground mb-6">O veículo solicitado não foi encontrado.</p>
            <Button onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Calculate daily rate (mock for now)
  const dailyRate = Math.floor(Math.random() * 200) + 100;
  const totalDays = calculateDays();
  const totalAmount = totalDays * dailyRate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast({
        title: "Erro",
        description: "Por favor, preencha as datas de início e fim.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast({
        title: "Erro",
        description: "A data de fim deve ser posterior à data de início.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call for rental request
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação foi enviada e será analisada em breve.",
      });

      navigate("/dashboard");
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Car Information */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Veículo</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={
                  car.foto_principal_url
                    ? `http://localhost:3001${car.foto_principal_url}`
                    : "/placeholder.svg"
                }
                alt={`${car.marca} ${car.modelo}`}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />


              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{car.marca} {car.modelo}</h3>
                  <p className="text-muted-foreground">{car.ano}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Placa: {car.placa}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Cor: {car.cor}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Diária:</span>
                    <span className="text-2xl font-bold text-primary">R$ {dailyRate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitação de Aluguel</CardTitle>
              <CardDescription>
                Preencha o período desejado para o aluguel
              </CardDescription>
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
                          <span className="font-medium">R$ {dailyRate}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total:</span>
                          <span className="text-2xl font-bold text-primary">
                            R$ {totalAmount.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!startDate || !endDate || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Confirmar Solicitação"
                  )}
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