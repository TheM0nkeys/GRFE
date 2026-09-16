export type PerfilUsuario = 'Administrador' | 'Usuário' | 'Plantonista';

export interface Usuario {
  id?: number;
  nome: string;
  iniciais: string;
  email: string;
  perfil: PerfilUsuario;
  equipe?: string;
  setor?: string;
  especialidade?: string;
  especialidadeId?: number | null;
  matricula?: string;
  especialidadeIds?: number[];
}
