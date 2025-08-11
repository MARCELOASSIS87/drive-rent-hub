export interface ContratoAluguel {
  id: number;
  motorista: {
    nome: string;
    cpf: string;
    email: string;
  };
  veiculo: {
    marca: string;
    modelo: string;
    ano: number;
    placa: string;
  };
  periodo: {
    dataInicio: string;
    dataFim: string;
  };
  valorTotal: number;
  status: 'pendente_assinatura' | 'pronto_para_assinatura' | 'assinado' | 'cancelado';
  dataAssinatura?: string;
}