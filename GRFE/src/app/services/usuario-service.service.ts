import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario';

export interface FuncionarioResponse {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  especialidades: string[];
}

export interface FuncionarioRequest {
  nome: string;
  matricula: string;
  email: string;
  especialidadeIds: number[];
}

export interface EspecialidadeResponse {
  id: number;
  nome: string;
  descricao?: string;
  divisaoId?: number;
  divisaoNome?: string;
  departamentoId?: number;
  departamentoNome?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceService {
  private readonly apiUrl = 'http://localhost:8080/';

  constructor(private readonly http: HttpClient) {}

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<FuncionarioResponse[]>(`${this.apiUrl}/funcionarios`).pipe(
      map((funcionarios) => funcionarios.map((funcionario) => this.toUsuario(funcionario)))
    );
  }

  buscarUsuario(id: number): Observable<Usuario | undefined> {
    return this.http.get<FuncionarioResponse>(`${this.apiUrl}/funcionarios/${id}`).pipe(
      map((funcionario) => this.toUsuario(funcionario))
    );
  }

  criarUsuario(dados: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<FuncionarioResponse>(`${this.apiUrl}/funcionarios`, this.toRequest(dados)).pipe(
      map((funcionario) => this.toUsuario(funcionario))
    );
  }

  atualizarUsuario(id: number, dados: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<FuncionarioResponse>(`${this.apiUrl}/funcionarios/${id}`, this.toRequest(dados)).pipe(
      map((funcionario) => this.toUsuario(funcionario))
    );
  }

  excluirUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/funcionarios/${id}`);
  }

  listarEspecialidades(): Observable<EspecialidadeResponse[]> {
    return this.http.get<EspecialidadeResponse[]>(`${this.apiUrl}/especialidades`);
  }

  private toUsuario(funcionario: FuncionarioResponse): Usuario {
    const especialidade = funcionario.especialidades?.[0];

    return {
      id: funcionario.id,
      nome: funcionario.nome,
      iniciais: this.gerarIniciais(funcionario.nome),
      email: funcionario.email,
      perfil: 'Usuário',
      equipe: undefined,
      setor: undefined,
      especialidade,
      especialidadeId: undefined,
      matricula: funcionario.matricula,
      especialidadeIds: [],
    };
  }

  private toRequest(dados: Partial<Usuario>): FuncionarioRequest {
    const especialidadeIds = (dados.especialidadeIds ?? []).filter((id): id is number => typeof id === 'number' && Number.isFinite(id));

    return {
      nome: dados.nome ?? '',
      matricula: dados.matricula ?? '',
      email: dados.email ?? '',
      especialidadeIds
    };
  }

  private gerarIniciais(nome: string): string {
    return nome
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte.charAt(0).toUpperCase())
      .join('');
  }
}
