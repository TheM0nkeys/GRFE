import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminItem, AdminService } from '../../../../services/admin-service.service';
import { Escala, EscalaRequest } from '../../../../models/escala';

@Component({
  selector: 'app-gerenciador-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerenciador-admin.component.html',
  styleUrl: './gerenciador-admin.component.scss'
})
export class GerenciadorAdminComponent implements OnInit {
  aba: 'setores' | 'escalas' | 'equipes' | 'perfis' = 'setores';
  carregando = false;
  erro = '';
  editandoId: number | null = null;
  setores: AdminItem[] = [];
  equipes: AdminItem[] = [];
  perfis: AdminItem[] = [];
  escalas: Escala[] = [];
  especialidades: AdminItem[] = [];
  funcionarios: AdminItem[] = [];
  nome = '';
  descricao = '';
  divisaoId: number | null = null;
  escala: EscalaRequest = { dataHoraInicio: '', dataHoraFim: '', especialidadeId: 0, funcionarioId: 0 };

  constructor(private readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.carregarTudo();
  }

  carregarTudo(): void {
    this.carregando = true;
    this.erro = '';
    this.adminService.listarSetores().subscribe({ next: (dados) => this.setores = dados, error: (error) => this.mostrarErro(error) });
    this.adminService.listarEquipes().subscribe({ next: (dados) => this.equipes = dados, error: (error) => this.mostrarErro(error) });
    this.adminService.listarPerfis().subscribe({ next: (dados) => this.perfis = dados, error: (error) => this.mostrarErro(error) });
    this.adminService.listarEscalas().subscribe({ next: (dados) => { this.escalas = dados; this.carregando = false; }, error: (error) => this.mostrarErro(error) });
    this.adminService.listarEspecialidades().subscribe({ next: (dados) => this.especialidades = dados, error: (error) => this.mostrarErro(error) });
    this.adminService.listarFuncionarios().subscribe({ next: (dados) => this.funcionarios = dados, error: (error) => this.mostrarErro(error) });
  }

  salvar(): void {
    this.erro = '';
    if (this.aba === 'escalas') {
      const operacao = this.editandoId === null
        ? this.adminService.criarEscala(this.escala)
        : this.adminService.atualizarEscala(this.editandoId, this.escala);
      operacao.subscribe({ next: () => this.finalizarEdicao(), error: (error) => this.mostrarErro(error) });
      return;
    }

    if (!this.nome.trim()) {
      this.erro = 'Informe um nome.';
      return;
    }

    if (this.aba === 'setores') {
      const dados = { nome: this.nome.trim(), divisaoId: this.divisaoId ?? 0 };
      const operacao = this.editandoId === null ? this.adminService.criarSetor(dados) : this.adminService.atualizarSetor(this.editandoId, dados);
      operacao.subscribe({ next: () => this.finalizarEdicao(), error: (error) => this.mostrarErro(error) });
    } else if (this.aba === 'equipes') {
      const operacao = this.editandoId === null ? this.adminService.criarEquipe({ nome: this.nome.trim() }) : this.adminService.atualizarEquipe(this.editandoId, { nome: this.nome.trim() });
      operacao.subscribe({ next: () => this.finalizarEdicao(), error: (error) => this.mostrarErro(error) });
    } else {
      const dados = { nome: this.nome.trim(), descricao: this.descricao.trim() };
      const operacao = this.editandoId === null ? this.adminService.criarPerfil(dados) : this.adminService.atualizarPerfil(this.editandoId, dados);
      operacao.subscribe({ next: () => this.finalizarEdicao(), error: (error) => this.mostrarErro(error) });
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
      this.divisaoId = null;
    }
  }

  excluir(item: AdminItem | Escala): void {
    const id = Number(item.id);
    if (id < 1) {
      return;
    }

    const operacao = 'dataHoraInicio' in item
      ? this.adminService.excluirEscala(id)
      : this.aba === 'setores' ? this.adminService.excluirSetor(id) : this.aba === 'equipes' ? this.adminService.excluirEquipe(id) : this.adminService.excluirPerfil(id);
    operacao.subscribe({ next: () => this.carregarTudo(), error: (error) => this.mostrarErro(error) });
  }

  trocarAba(aba: 'setores' | 'escalas' | 'equipes' | 'perfis'): void {
    this.aba = aba;
    this.cancelar();
  }

  cancelar(): void {
    this.editandoId = null;
    this.nome = '';
    this.descricao = '';
    this.divisaoId = null;
    this.escala = { dataHoraInicio: '', dataHoraFim: '', especialidadeId: 0, funcionarioId: 0 };
  }

  private finalizarEdicao(): void {
    this.cancelar();
    this.carregarTudo();
  }

  private mostrarErro(error: { error?: { mensagem?: string }; message?: string }): void {
    this.carregando = false;
    this.erro = error.error?.mensagem ?? error.message ?? 'Não foi possível concluir a operação.';
  }
}
