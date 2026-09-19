export type PerfilUsuario = 'Administrador' | 'Usuário';

export interface Usuario {
  id?: number;
  nome: string;
  iniciais: string;
  email: string;
  perfil: PerfilUsuario;
  setor?: string;
  especialidade?: string;
  especialidadeId?: number | null;
  matricula?: string;
  especialidadeIds?: number[];
}
