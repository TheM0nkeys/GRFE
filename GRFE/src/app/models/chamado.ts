export type StatusChamado = 'Aberto' | 'Em andamento' | 'Resolvido' | 'Sem status';
export type SeveridadeChamado = 'Crítica' | 'Alta' | 'Média' | 'Baixa' | 'Sem severidade';

export interface AtualizacaoChamado {
	autor: string;
	dataHora: string;
	texto: string;
}

export interface Chamado {
	id: string;
	titulo: string;
	setor: string;
	severidade: SeveridadeChamado;
	responsavel: string;
	usuarioResponsavelId?: number | null;
	data: string;
	status: StatusChamado;
	especialidade: string;
	especialidadeId?: number | null;
	plantonista: string;
	plantonistaId?: number | null;
	motivo: string;
	descricao: string;
	updates: number;
	atualizacoes: AtualizacaoChamado[];
}

export type StatusChamadoApi = 'ABERTO' | 'EM_ANDAMENTO' | 'FECHADO';

export interface ChamadoResponse {
	id: number;
	dataHoraAcionamento: string;
	especialidadeId: number;
	especialidadeNome: string;
	plantonistaId: number;
	plantonistaNome: string;
	usuarioResponsavelId: number;
	usuarioResponsavelNome: string;
	motivo: string;
	numeroIncidente: string | null;
	status: StatusChamadoApi;
}

