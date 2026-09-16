import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Escala, EscalaRequest } from '../models/escala';

export interface AdminItem {
  id: number;
  nome: string;
  descricao?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  listarSetores(): Observable<AdminItem[]> {
    return this.http.get<AdminItem[]>(`${this.apiUrl}/departamentos`);
  }

  criarSetor(dados: { nome: string; divisaoId: number }): Observable<AdminItem> {
    return this.http.post<AdminItem>(`${this.apiUrl}/departamentos`, dados);
  }

  atualizarSetor(id: number, dados: { nome: string; divisaoId: number }): Observable<AdminItem> {
    return this.http.put<AdminItem>(`${this.apiUrl}/departamentos/${id}`, dados);
  }

  excluirSetor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/departamentos/${id}`);
  }

  listarEscalas(): Observable<Escala[]> {
    return this.http.get<Escala[]>(`${this.apiUrl}/escalas`);
  }

  listarEspecialidades(): Observable<AdminItem[]> {
    return this.http.get<AdminItem[]>(`${this.apiUrl}/especialidades`);
  }

  listarFuncionarios(): Observable<AdminItem[]> {
    return this.http.get<AdminItem[]>(`${this.apiUrl}/funcionarios`);
  }

  criarEscala(dados: EscalaRequest): Observable<Escala> {
    return this.http.post<Escala>(`${this.apiUrl}/escalas`, dados);
  }

  atualizarEscala(id: number, dados: EscalaRequest): Observable<Escala> {
    return this.http.put<Escala>(`${this.apiUrl}/escalas/${id}`, dados);
  }

  excluirEscala(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/escalas/${id}`);
  }

  listarEquipes(): Observable<AdminItem[]> {
    return this.http.get<AdminItem[]>(`${this.apiUrl}/equipes`);
  }

  criarEquipe(dados: { nome: string }): Observable<AdminItem> {
    return this.http.post<AdminItem>(`${this.apiUrl}/equipes`, dados);
  }

  atualizarEquipe(id: number, dados: { nome: string }): Observable<AdminItem> {
    return this.http.put<AdminItem>(`${this.apiUrl}/equipes/${id}`, dados);
  }

  excluirEquipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/equipes/${id}`);
  }

  listarPerfis(): Observable<AdminItem[]> {
    return this.http.get<AdminItem[]>(`${this.apiUrl}/perfis`);
  }

  criarPerfil(dados: { nome: string; descricao?: string }): Observable<AdminItem> {
    return this.http.post<AdminItem>(`${this.apiUrl}/perfis`, dados);
  }

  atualizarPerfil(id: number, dados: { nome: string; descricao?: string }): Observable<AdminItem> {
    return this.http.put<AdminItem>(`${this.apiUrl}/perfis/${id}`, dados);
  }

  excluirPerfil(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/perfis/${id}`);
  }
}
