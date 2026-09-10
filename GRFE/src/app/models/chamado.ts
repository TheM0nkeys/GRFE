export type StatusChamado = 'Aberto' | 'Em andamento' | 'Resolvido';
export type SeveridadeChamado = 'Crítica' | 'Alta' | 'Média' | 'Baixa';

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
	data: string;
	status: StatusChamado;
	especialidade: string;
	plantonista: string;
	motivo: string;
	descricao: string;
	updates: number;
	atualizacoes: AtualizacaoChamado[];
}
