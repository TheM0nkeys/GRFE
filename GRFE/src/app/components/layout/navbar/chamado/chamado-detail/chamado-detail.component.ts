import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Chamado } from '../../../../../models/chamado';
import { ChamadoService } from '../../../../../services/chamado-service.service';
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

  readonly setores = ['Geração', 'Transmissão', 'Subestação', 'Manutenção Mecânica', 'Manutenção Elétrica', 'TI & Sistemas', 'Segurança', 'Civil'];
  readonly severidades = ['Crítica', 'Alta', 'Média', 'Baixa'] as const;
  readonly statuses = ['Aberto', 'Em andamento', 'Resolvido'] as const;

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
          data: this.chamado.data,
          status: this.chamado.status,
          especialidade: this.chamado.especialidade,
          plantonista: this.chamado.plantonista,
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

  private camposInvalidos(form: NgForm): string[] {
    return Object.keys(form.controls).filter((nome) => form.controls[nome].invalid);
  }

  private novoChamado(): Chamado {
    return {
      id: '', titulo: '', setor: 'TI & Sistemas', severidade: 'Média', responsavel: '', data: new Date().toISOString().slice(0, 10),
      status: 'Aberto', especialidade: '', plantonista: '', motivo: '', descricao: '', updates: 0, atualizacoes: []
    };
  }

  getStatus(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getSeriedade(severidade: string): string {
    return severidade.toLowerCase().replace('í', 'i');
  }
}
