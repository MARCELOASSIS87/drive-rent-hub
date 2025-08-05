const ActiveRentals = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Aluguéis Ativos</h1>
        <p className="text-muted-foreground">Veja os veículos que você está alugando atualmente.</p>
      </div>
      <p className="text-muted-foreground">Nenhum aluguel ativo no momento.</p>
    </div>
  );
};

export default ActiveRentals;