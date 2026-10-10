export interface Escala {
	id?: number;
	dataHoraInicio: string;
	dataHoraFim: string;
	especialidadeId: number;
	especialidadeNome?: string;
	funcionarioId: number;
	funcionarioNome?: string;
}

export type EscalaRequest = Pick<Escala, 'dataHoraInicio' | 'dataHoraFim' | 'especialidadeId' | 'funcionarioId'>;
