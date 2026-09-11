export type PerfilUsuario = 'Administrador' | 'Usuário';

export interface Usuario {
  nome: string;
  iniciais: string;
  email: string;
  perfil: PerfilUsuario;
  equipe: string;
  setor: string;
}
