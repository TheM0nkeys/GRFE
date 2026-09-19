export interface HistoricoAcionamentoResponse {
	id: number;
	dataHora: string;
	autorId: number;
	autorNome: string;
	comentario: string;
}

export interface HistoricoAcionamentoRequest {
	dataHora: string;
	autorId: number;
	comentario: string;
}
