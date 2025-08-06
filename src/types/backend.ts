export interface Driver {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  cnh_numero: string;
  cnh_validade: string;
  cnh_data_emissao: string;
  cnh_categoria: string;
  cnh_ear: boolean;
  cnh_foto_url: string;
  foto_perfil_url: string;
  selfie_cnh_url: string;
  comprovante_endereco_url: string;
  comprovante_vinculo_url: string;
  antecedentes_criminais_url: string;
  status: 'em_analise' | 'aprovado' | 'recusado' | 'bloqueado';
}

export interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  renavam: string;
  cor: string;
  numero_seguro: string;
  status: 'disponivel' | 'em uso' | 'manutencao';
  manutencao_proxima_data: string;
  valor_diaria: number;
  foto_principal_url: string;
  foto_principal?: string;
  fotos_urls: string;
  ativo: number;
}

export interface RentalRequest {
  id: number;
  motorista_id: number;
  motorista_nome: string;
  motorista_email: string;

  veiculo_id: number;
  marca: string;   // Marca do carro
  modelo: string;  // Modelo do carro
  placa: string;   // Placa do carro

  data_inicio: string;
  data_fim: string;
  valor_total: number;
  status: "pendente" | "aprovado" | "recusado";

  // Se o back já te devolve o objeto inteiro, pode aninhar:
  motorista?: {
    nome: string;
    email: string;
    // …outros campos do motorista
  };
  veiculo?: {
    marca: string;
    modelo: string;
    placa: string;
    // …outros campos do veículo
  };
}

export interface AdminLoginResponse {
  token: string;
  nome: string;
  role: 'comum' | 'super';
}

export interface DriverLoginResponse {
  token: string;
  motorista: {
    id: number;
    nome: string;
    email: string;
  };
}

export interface ApiError {
  error: string;
  detalhes?: string;
}