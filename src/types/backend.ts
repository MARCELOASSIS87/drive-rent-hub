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
  foto_principal_url: string;
  foto_principal?: string;
  fotos_urls: string;
  ativo: number;
}

export interface AdminLoginResponse {
  token: string;
  nome: string;
  role: 'admin' | 'super';
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