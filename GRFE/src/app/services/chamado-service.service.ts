import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Acionamento } from '../models/acionamento.model';

@Injectable({
  providedIn: 'root'
})
export class AcionamentoService {

  // Dados fictícios (mock)
  private mockAcionamentos: Acionamento[] = [
    {
      dataHora: '31/08, 06:45',
      especialidade: 'STORAGE',
      plantonista: 'Roberto Silva',
      incidente: 'INC0047835',
      motivo: 'Backup noturno do ambiente de produção não c...',
      status: 'Aberto',
      updates: 0
    },
    {
      dataHora: '31/08, 02:15',
      especialidade: 'DBA',
      plantonista: 'Carlos Eduardo',
      incidente: 'INC0047821',
      motivo: 'Lentidão crítica no banco de dados Oracle PROD...',
      status: 'Em Andamento',
      updates: 3
    },
    {
      dataHora: '30/08, 23:47',
      especialidade: 'INFRA',
      plantonista: 'Roberto Silva',
      incidente: 'INC0047810',
      motivo: 'Servidor de aplicação APP-PRD-07 com consum...',
      status: 'Concluído',
      updates: 3
    },
    {
      dataHora: '30/08, 18:33',
      especialidade: 'REDES',
      plantonista: 'Fernando Alves',
      incidente: 'INC0047798',
      motivo: 'Queda de link MPLS para subestação SE-17. Equi...',
      status: 'Concluído',
      updates: 3
    },
    {
      dataHora: '29/08, 14:20',
      especialidade: 'SEC',
      plantonista: 'Diego Carvalho',
      incidente: 'INC0047750',
      motivo: 'Bloqueio inesperado de tráfego legítimo no firew...',
      status: 'Concluído',
      updates: 2
    },
    {
      dataHora: '28/08, 08:10',
      especialidade: 'SAP',
      plantonista: 'Thiago Nascimento',
      incidente: 'INC0047720',
      motivo: 'Falha na execução do job de fechamento mensal...',
      status: 'Concluído',
      updates: 2
    }
  ];

  constructor() { }

  // Retorna um Observable imitando uma chamada assíncrona de API
  getAcionamentos(): Observable<Acionamento[]> {
    return of(this.mockAcionamentos);
  }
}
