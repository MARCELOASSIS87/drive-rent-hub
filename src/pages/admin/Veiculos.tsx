import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { vehiclesAPI } from "@/services/api";
import { Vehicle } from "@/types/backend";

const Veiculos = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    ano: "",
    placa: "",
    renavam: "",
    cor: "",
    numero_seguro: "",
    status: "disponível",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehiclesAPI.list();
      setVehicles(response.data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar veículos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      marca: "",
      modelo: "",
      ano: "",
      placa: "",
      renavam: "",
      cor: "",
      numero_seguro: "",
      status: "disponível",
    });
    setSelectedFile(null);
  };

  const handleAdd = async () => {
    if (!formData.marca || !formData.modelo || !formData.ano || !formData.placa) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(-1);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      if (selectedFile) {
        data.append("foto_principal", selectedFile);
      }

      await vehiclesAPI.create(data);
      
      toast({
        title: "Veículo adicionado",
        description: `${formData.marca} ${formData.modelo} foi adicionado com sucesso`,
      });
      
      setShowAddDialog(false);
      resetForm();
      loadVehicles();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.error || "Erro ao adicionar veículo",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = async () => {
    if (!selectedVehicle || !formData.marca || !formData.modelo || !formData.ano || !formData.placa) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(selectedVehicle.id);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      if (selectedFile) {
        data.append("foto_principal", selectedFile);
      }

      await vehiclesAPI.update(selectedVehicle.id, data);
      
      toast({
        title: "Veículo atualizado",
        description: `${formData.marca} ${formData.modelo} foi atualizado com sucesso`,
      });
      
      setShowEditDialog(false);
      setSelectedVehicle(null);
      resetForm();
      loadVehicles();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.error || "Erro ao atualizar veículo",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedVehicle) return;

    try {
      setActionLoading(selectedVehicle.id);
      await vehiclesAPI.delete(selectedVehicle.id);
      
      toast({
        title: "Veículo removido",
        description: `${selectedVehicle.marca} ${selectedVehicle.modelo} foi removido`,
      });
      
      setShowDeleteDialog(false);
      setSelectedVehicle(null);
      loadVehicles();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.error || "Erro ao remover veículo",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      ano: vehicle.ano.toString(),
      placa: vehicle.placa,
      renavam: vehicle.renavam,
      cor: vehicle.cor,
      numero_seguro: vehicle.numero_seguro,
      status: vehicle.status,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponível":
        return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
      case "em uso":
        return <Badge className="bg-blue-100 text-blue-800">Em Uso</Badge>;
      case "manutenção":
        return <Badge className="bg-yellow-100 text-yellow-800">Manutenção</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Veículos</h1>
          <p className="text-muted-foreground">
            Gerencie a frota de veículos disponíveis para aluguel
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Veículo</DialogTitle>
              <DialogDescription>
                Preencha as informações do veículo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="marca">Marca *</Label>
                  <Input
                    id="marca"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    placeholder="Ex: Toyota"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modelo">Modelo *</Label>
                  <Input
                    id="modelo"
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    placeholder="Ex: Corolla"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ano">Ano *</Label>
                  <Input
                    id="ano"
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                    placeholder="Ex: 2022"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cor">Cor</Label>
                  <Input
                    id="cor"
                    value={formData.cor}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    placeholder="Ex: Prata"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="placa">Placa *</Label>
                  <Input
                    id="placa"
                    value={formData.placa}
                    onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                    placeholder="Ex: ABC-1234"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="renavam">RENAVAM</Label>
                  <Input
                    id="renavam"
                    value={formData.renavam}
                    onChange={(e) => setFormData({ ...formData, renavam: e.target.value })}
                    placeholder="Ex: 12345678901"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="numero_seguro">Número do Seguro</Label>
                  <Input
                    id="numero_seguro"
                    value={formData.numero_seguro}
                    onChange={(e) => setFormData({ ...formData, numero_seguro: e.target.value })}
                    placeholder="Ex: SEG123456"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponível">Disponível</SelectItem>
                      <SelectItem value="em uso">Em Uso</SelectItem>
                      <SelectItem value="manutenção">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="foto">Foto Principal</Label>
                <Input
                  id="foto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd} disabled={actionLoading === -1}>
                {actionLoading === -1 ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Adicionar Veículo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frota de Veículos</CardTitle>
          <CardDescription>
            {vehicles.length} veículo{vehicles.length !== 1 ? 's' : ''} cadastrado{vehicles.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum veículo cadastrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {vehicle.marca} {vehicle.modelo}
                    </TableCell>
                    <TableCell>{vehicle.placa}</TableCell>
                    <TableCell>{vehicle.ano}</TableCell>
                    <TableCell>{vehicle.cor}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(vehicle)}
                          disabled={actionLoading === vehicle.id}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(vehicle)}
                          disabled={actionLoading === vehicle.id}
                        >
                          {actionLoading === vehicle.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Veículo</DialogTitle>
            <DialogDescription>
              Atualize as informações do veículo
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-marca">Marca *</Label>
                <Input
                  id="edit-marca"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-modelo">Modelo *</Label>
                <Input
                  id="edit-modelo"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-ano">Ano *</Label>
                <Input
                  id="edit-ano"
                  type="number"
                  value={formData.ano}
                  onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-cor">Cor</Label>
                <Input
                  id="edit-cor"
                  value={formData.cor}
                  onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-placa">Placa *</Label>
                <Input
                  id="edit-placa"
                  value={formData.placa}
                  onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponível">Disponível</SelectItem>
                    <SelectItem value="em uso">Em Uso</SelectItem>
                    <SelectItem value="manutenção">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-foto">Nova Foto (opcional)</Label>
              <Input
                id="edit-foto"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={actionLoading === selectedVehicle?.id}>
              {actionLoading === selectedVehicle?.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o veículo {selectedVehicle?.marca} {selectedVehicle?.modelo}?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={actionLoading === selectedVehicle?.id}
            >
              {actionLoading === selectedVehicle?.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Veiculos;