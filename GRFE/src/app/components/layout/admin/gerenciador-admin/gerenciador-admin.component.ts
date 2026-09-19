import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminItem, AdminService } from '../../../../services/admin-service.service';
import { Escala, EscalaRequest } from '../../../../models/escala';
import { EscolhaDropdownComponent } from '../../../shared/escolha-dropdown/escolha-dropdown.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gerenciador-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, EscolhaDropdownComponent],
  templateUrl: './gerenciador-admin.component.html',
  styleUrl: './gerenciador-admin.component.scss'
})
export class GerenciadorAdminComponent implements OnInit {
  aba: 'divisoes' | 'setores' | 'especialidades' | 'escalas' = 'divisoes';
  carregando = false;
  erro = '';
  editandoId: number | null = null;
  divisoes: AdminItem[] = [];
  setores: AdminItem[] = [];
  especialidades: AdminItem[] = [];
  escalas: Escala[] = [];
  funcionarios: AdminItem[] = [];
  nome = '';
  descricao = '';
  divisaoId: number | null = null;
  departamentoId: number | null = null;
  escala: EscalaRequest = { dataHoraInicio: '', dataHoraFim: '', especialidadeId: 0, funcionarioId: 0 };

  constructor(private readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.carregarTudo();
  }

  carregarTudo(): void {
    this.carregando = true;
    this.erro = '';
    this.adminService.listarDivisoes().subscribe({ next: (dados) => this.divisoes = dados, error: (error) => this.mostrarErro(error) });
    this.adminService.listarSetores().subscribe({ next: (dados) => this.setores = dados, error: (error) => this.mostrarErro(error) });
    this.adminService.listarEscalas().subscribe({ next: (dados) => { this.escalas = dados; this.carregando = false; }, error: (error) => this.mostrarErro(error) });
    this.adminService.listarEspecialidades().subscribe({ next: (dados) => this.especialidades = dados, error: (error) => this.mostrarErro(error) });
    this.adminService.listarFuncionarios().subscribe({ next: (dados) => this.funcionarios = dados, error: (error) => this.mostrarErro(error) });
  }

  salvar(): void {
    this.erro = '';
    if (this.aba === 'escalas') {
      if (!this.escala.dataHoraInicio || !this.escala.dataHoraFim || this.escala.especialidadeId < 1 || this.escala.funcionarioId < 1) {
        void Swal.fire({ icon: 'warning', title: 'Informações incompletas', text: 'Preencha início, fim, especialidade e funcionário.' });
        return;
      }

      const operacao = this.editandoId === null
        ? this.adminService.criarEscala(this.escala)
        : this.adminService.atualizarEscala(this.editandoId, this.escala);
      operacao.subscribe({
        next: () => {
          void Swal.fire({ icon: 'success', title: this.editandoId === null ? 'Escala criada!' : 'Escala atualizada!', text: 'A operação foi concluída.' });
          this.finalizarEdicao();
        },
        error: (error) => this.mostrarErro(error)
      });
      return;
    }

    if (!this.nome.trim()) {
      this.erro = 'Informe um nome.';
      void Swal.fire({ icon: 'warning', title: 'Nome obrigatório', text: 'Informe um nome antes de salvar.' });
      return;
    }

    if (this.aba === 'setores') {
      if (!this.divisaoId || this.divisaoId < 1) {
        void Swal.fire({ icon: 'warning', title: 'Divisão obrigatória', text: 'Informe uma divisão válida para o setor.' });
        return;
      }
      const dados = { nome: this.nome.trim(), divisaoId: this.divisaoId ?? 0 };
      const operacao = this.editandoId === null ? this.adminService.criarSetor(dados) : this.adminService.atualizarSetor(this.editandoId, dados);
      operacao.subscribe({
        next: () => {
          void Swal.fire({ icon: 'success', title: this.editandoId === null ? 'Setor criado!' : 'Setor atualizado!', text: 'A operação foi concluída.' });
          this.finalizarEdicao();
        },
        error: (error) => this.mostrarErro(error)
      });
    } else if (this.aba === 'divisoes') {
      const operacao = this.editandoId === null ? this.adminService.criarDivisao({ nome: this.nome.trim() }) : this.adminService.atualizarDivisao(this.editandoId, { nome: this.nome.trim() });
      this.executarCrud(operacao, this.editandoId === null ? 'Divisão criada!' : 'Divisão atualizada!');
    } else if (this.aba === 'especialidades') {
      if (!this.divisaoId || this.divisaoId < 1 || !this.departamentoId || this.departamentoId < 1) {
        void Swal.fire({ icon: 'warning', title: 'Escolhas obrigatórias', text: 'Selecione uma divisão e um setor para a especialidade.' });
        return;
      }
      const dados = { nome: this.nome.trim(), descricao: this.descricao.trim(), divisaoId: this.divisaoId, departamentoId: this.departamentoId };
      const operacao = this.editandoId === null ? this.adminService.criarEspecialidade(dados) : this.adminService.atualizarEspecialidade(this.editandoId, dados);
      this.executarCrud(operacao, this.editandoId === null ? 'Especialidade criada!' : 'Especialidade atualizada!');
    }
  }

  editar(item: AdminItem | Escala): void {
    const id = Number(item.id);
    if (id < 1) {
      return;
    }

    this.editandoId = id;
    if ('dataHoraInicio' in item) {
      this.aba = 'escalas';
      this.escala = { dataHoraInicio: item.dataHoraInicio.slice(0, 16), dataHoraFim: item.dataHoraFim.slice(0, 16), especialidadeId: item.especialidadeId, funcionarioId: item.funcionarioId };
    } else {
      this.nome = item.nome;
      this.descricao = item.descricao ?? '';
      if (this.aba === 'especialidades') {
        this.divisaoId = item.divisaoId ?? null;
        this.departamentoId = item.departamentoId ?? null;
      } else if (this.aba === 'setores') {
        this.divisaoId = item.divisaoId ?? null;
      }
    }
  }

  excluir(item: AdminItem | Escala): void {
    const id = Number(item.id);
    if (id < 1) {
      return;
    }

    void Swal.fire({
      icon: 'warning',
      title: 'Confirmar exclusão',
      text: 'Esta ação não poderá ser desfeita.',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar'
    }).then((resultado) => {
      if (!resultado.isConfirmed) {
        return;
      }

      const operacao = 'dataHoraInicio' in item
      ? this.adminService.excluirEscala(id)
      : this.aba === 'divisoes' ? this.adminService.excluirDivisao(id) : this.aba === 'setores' ? this.adminService.excluirSetor(id) : this.adminService.excluirEspecialidade(id);
      operacao.subscribe({
        next: () => {
          void Swal.fire({ icon: 'success', title: 'Excluído!', text: 'O registro foi removido.' });
          this.carregarTudo();
        },
        error: (error) => this.mostrarErro(error)
      });
    });
  }

  trocarAba(aba: 'divisoes' | 'setores' | 'especialidades' | 'escalas'): void {
    this.aba = aba;
    this.cancelar();
  }

  cancelar(): void {
    this.editandoId = null;
    this.nome = '';
    this.descricao = '';
    this.divisaoId = null;
    this.departamentoId = null;
    this.escala = { dataHoraInicio: '', dataHoraFim: '', especialidadeId: 0, funcionarioId: 0 };
  }

  private finalizarEdicao(): void {
    this.cancelar();
    this.carregarTudo();
  }

  private executarCrud(operacao: import('rxjs').Observable<AdminItem>, mensagem: string): void {
    operacao.subscribe({
      next: () => {
        void Swal.fire({ icon: 'success', title: mensagem, text: 'A operação foi concluída.' });
        this.finalizarEdicao();
      },
      error: (error) => this.mostrarErro(error)
    });
  }

  private mostrarErro(error: { error?: { mensagem?: string }; message?: string }): void {
    this.carregando = false;
    this.erro = error.error?.mensagem ?? error.message ?? 'Não foi possível concluir a operação.';
    void Swal.fire({ icon: 'error', title: 'Erro na operação', text: this.erro });
  }
}
