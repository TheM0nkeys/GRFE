export type StatusAcionamento = 'Aberto' | 'Em Andamento' | 'Concluído';

export interface Acionamento {
  dataHora: string;
  especialidade: string;
  plantonista: string;
  incidente: string;
  motivo: string;
  status: StatusAcionamento;
  updates: number;
}
