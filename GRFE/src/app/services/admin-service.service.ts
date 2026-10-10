import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Escala, EscalaRequest } from '../models/escala';

export interface AdminItem {
  id: number;
  nome: string;
  descricao?: string;
  divisaoId?: number;
  departamentoId?: number;
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

  listarDivisoes(): Observable<AdminItem[]> {
    return this.http.get<AdminItem[]>(`${this.apiUrl}/divisoes`);
  }

  criarDivisao(dados: { nome: string }): Observable<AdminItem> {
    return this.http.post<AdminItem>(`${this.apiUrl}/divisoes`, dados);
  }

  atualizarDivisao(id: number, dados: { nome: string }): Observable<AdminItem> {
    return this.http.put<AdminItem>(`${this.apiUrl}/divisoes/${id}`, dados);
  }

  excluirDivisao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/divisoes/${id}`);
  }

  listarEscalas(): Observable<Escala[]> {
    return this.http.get<Escala[]>(`${this.apiUrl}/escalas`);
  }

  listarEspecialidades(): Observable<AdminItem[]> {
    return this.http.get<AdminItem[]>(`${this.apiUrl}/especialidades`);
  }

  atualizarEspecialidade(id: number, dados: { nome: string; descricao?: string; divisaoId: number; departamentoId: number }): Observable<AdminItem> {
    return this.http.put<AdminItem>(`${this.apiUrl}/especialidades/${id}`, dados);
  }

  excluirEspecialidade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/especialidades/${id}`);
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

  criarEspecialidade(dados: { nome: string; descricao?: string; divisaoId: number; departamentoId: number }): Observable<AdminItem> {
    return this.http.post<AdminItem>(`${this.apiUrl}/especialidades`, dados);
  }
}
