export interface RelatorioKpi {
  titulo: string;
  valor: string;
  detalhe: string;
}

export interface TendenciaMensal {
  labels: string[];
  criticos: number[];
  resolvidos: number[];
  total: number[];
}

export interface IncidentesPorSetor {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export interface RelatorioDados {
  kpis: RelatorioKpi[];
  tendenciaMensal: TendenciaMensal;
  incidentesPorSemana: {
    labels: string[];
    valores: number[];
  };
  incidentesPorSetor: IncidentesPorSetor;
  sobreaviso: ColaboradorSobreaviso[];
}

export interface ColaboradorSobreaviso {
  iniciais: string;
  nome: string;
  setor: string;
  totalPlantoes: number;
  maiorSequencia: number;
  alerta: string;
}
