import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Chamado } from '../../../../models/chamado';
import { ChamadoService } from '../../../../services/chamado-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chamado-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chamado-detail.component.html',
  styleUrl: './chamado-detail.component.scss'
})
export class ChamadoDetailComponent {
  chamado?: Chamado;
  modo: 'criar' | 'editar' = 'criar';
  salvando = false;

  readonly setores: string[] = [];
  readonly severidades = ['Crítica', 'Alta', 'Média', 'Baixa'] as const;
  readonly statuses = ['Aberto', 'Em andamento', 'Resolvido'] as const;
  readonly usuariosDisponiveis: Array<{ id: number; nome: string }> = [];
  readonly especialidadesDisponiveis: Array<{ id: number; nome: string }> = [];
  readonly plantonistasDisponiveis: Array<{ id: number; nome: string; especialidadeId: number; especialidadeNome: string }> = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly chamadoService: ChamadoService,
    private readonly router: Router
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'novo') {
      this.modo = 'editar';
      console.log('[ChamadoDetail] Abrindo edição do chamado:', id);
      this.chamadoService.obterChamado(id).subscribe((chamado) => {
        this.chamado = chamado;
        console.log('[ChamadoDetail] Chamado carregado:', chamado);
        if (!chamado) {
          console.error('[ChamadoDetail] Chamado não encontrado:', id);
          void Swal.fire({ icon: 'error', title: 'Chamado não encontrado', text: 'Não foi possível carregar este chamado.' });
        }
      });
    } else {
      this.chamado = this.novoChamado();
      console.log('[ChamadoDetail] Abrindo formulário de criação');
    }
  }

  salvar(form: NgForm): void {
    console.log('[ChamadoDetail] Clique em salvar', {
      modo: this.modo,
      valido: form.valid,
      valores: this.chamado
    });

    if (!this.chamado || this.salvando) {
      console.warn('[ChamadoDetail] Salvamento ignorado: chamado ausente ou operação em andamento');
      return;
    }

    if (form.invalid) {
      console.warn('[ChamadoDetail] Formulário inválido. Campos pendentes:', this.camposInvalidos(form));
      void Swal.fire({ icon: 'warning', title: 'Campos obrigatórios', text: 'Preencha todos os campos antes de salvar.' });
      return;
    }

    this.salvando = true;
    const operacao = this.modo === 'criar'
      ? this.chamadoService.criarChamado({
          titulo: this.chamado.titulo,
          setor: this.chamado.setor,
          severidade: this.chamado.severidade,
          responsavel: this.chamado.responsavel,
          usuarioResponsavelId: this.chamado.usuarioResponsavelId ?? null,
          data: this.chamado.data,
          status: this.chamado.status,
          especialidade: this.chamado.especialidade,
          especialidadeId: this.chamado.especialidadeId ?? null,
          plantonista: this.chamado.plantonista,
          plantonistaId: this.chamado.plantonistaId ?? null,
          motivo: this.chamado.motivo,
          descricao: this.chamado.descricao
        })
      : this.chamadoService.atualizarChamado(this.chamado);

    operacao.subscribe((chamado) => {
      this.salvando = false;
      console.log('[ChamadoDetail] Chamado salvo com sucesso:', chamado);
      void Swal.fire({
        icon: 'success',
        title: this.modo === 'criar' ? 'Chamado criado!' : 'Chamado atualizado!',
        text: `${chamado.id} foi salvo com sucesso.`,
        confirmButtonColor: '#244b82'
      }).then(() => this.router.navigate(['/navbar/chamados', chamado.id]));
    }, (erro) => {
      this.salvando = false;
      console.error('[ChamadoDetail] Erro ao salvar chamado:', erro);
      void Swal.fire({ icon: 'error', title: 'Erro ao salvar', text: 'Não foi possível salvar o chamado.' });
    });
  }

  cancelar(): void {
    console.log('[ChamadoDetail] Cancelando formulário e retornando para a lista');
    this.router.navigate(['/navbar/chamados']);
  }

  onResponsavelChange(): void {
    if (!this.chamado) {
      return;
    }

    const responsavel = this.usuariosDisponiveis.find((item) => item.id === this.chamado?.usuarioResponsavelId);
    this.chamado.responsavel = responsavel?.nome ?? '';
  }

  onPlantonistaChange(): void {
    if (!this.chamado) {
      return;
    }

    const plantonista = this.plantonistasDisponiveis.find((item) => item.id === this.chamado?.plantonistaId);
    if (!plantonista) {
      return;
    }

    this.chamado.plantonista = plantonista.nome;
    this.chamado.especialidadeId = plantonista.especialidadeId;
    this.chamado.especialidade = plantonista.especialidadeNome;
  }

  onEspecialidadeChange(): void {
    if (!this.chamado) {
      return;
    }

    const especialidade = this.especialidadesDisponiveis.find((item) => item.id === this.chamado?.especialidadeId);
    this.chamado.especialidade = especialidade?.nome ?? this.chamado.especialidade ?? '';
  }

  private camposInvalidos(form: NgForm): string[] {
    return Object.keys(form.controls).filter((nome) => form.controls[nome].invalid);
  }

  private novoChamado(): Chamado {
    return {
      id: '',
      titulo: '',
      setor: 'Sem setor',
      severidade: 'Média',
      responsavel: '',
      usuarioResponsavelId: null,
      data: new Date().toISOString().slice(0, 10),
      status: 'Aberto',
      especialidade: 'Sem especialidade',
      especialidadeId: null,
      plantonista: 'Sem plantonista',
      plantonistaId: null,
      motivo: '',
      descricao: '',
      updates: 0,
      atualizacoes: []
    };
  }

  getStatus(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getSeriedade(severidade: string): string {
    return severidade.toLowerCase().replace('í', 'i');
  }
}
