import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chamado } from '../../../../models/chamado';
import { ChamadoService } from '../../../../services/chamado-service.service';

@Component({
  selector: 'app-dash-geral',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash-geral.component.html',
  styleUrl: './dash-geral.component.scss'
})
export class DashGeralComponent implements OnInit {
  chamados: Chamado[] = [];
  carregando = true;
  nomeUsuario = localStorage.getItem('grfe.usuario.nome') || 'usuário';

  constructor(private readonly chamadoService: ChamadoService) {}

  ngOnInit(): void {
    this.chamadoService.obterChamados().subscribe({
      next: (chamados) => { this.chamados = chamados; this.carregando = false; },
      error: () => { this.carregando = false; }
    });
  }

  get abertos(): number { return this.chamados.filter((chamado) => chamado.status === 'Aberto').length; }
  get emAndamento(): number { return this.chamados.filter((chamado) => chamado.status === 'Em andamento').length; }
  get resolvidos(): number { return this.chamados.filter((chamado) => chamado.status === 'Resolvido').length; }
  get criticos(): number { return this.chamados.filter((chamado) => chamado.severidade === 'Crítica').length; }
  get recentes(): Chamado[] { return [...this.chamados].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 5); }

  get colaboradores(): { nome: string; total: number }[] {
    const totais = new Map<string, number>();
    this.chamados.forEach((chamado) => totais.set(chamado.responsavel, (totais.get(chamado.responsavel) ?? 0) + 1));
    return [...totais.entries()].map(([nome, total]) => ({ nome, total })).sort((a, b) => b.total - a.total).slice(0, 8);
  }

  get setores(): { nome: string; total: number; porcentagem: number }[] {
    const totais = new Map<string, number>();
    this.chamados.forEach((chamado) => { const setor = chamado.setor || 'Sem setor'; totais.set(setor, (totais.get(setor) ?? 0) + 1); });
    return [...totais.entries()].map(([nome, total]) => ({ nome, total, porcentagem: this.chamados.length ? total / this.chamados.length * 100 : 0 })).sort((a, b) => b.total - a.total);
  }

  get responsaveis(): { nome: string; total: number }[] { return this.colaboradores.slice(0, 2); }
  get periodoChamados(): string {
    const datas = this.chamados.map((chamado) => chamado.data).sort();
    return datas.length ? `${datas[0]} → ${datas[datas.length - 1]}` : 'Sem dados';
  }
  get gradienteSetores(): string {
    if (!this.setores.length) {
      return 'conic-gradient(#d6e0ef 0 100%)';
    }

    let inicio = 0;
    const cores = ['#1e4275', '#2f67df', '#0a9b73', '#d04435', '#e58100', '#7142de'];
    const faixas = this.setores.map((setor, index) => {
      const fim = inicio + setor.porcentagem;
      const faixa = `${cores[index % cores.length]} ${inicio}% ${fim}%`;
      inicio = fim;
      return faixa;
    });
    return `conic-gradient(${faixas.join(', ')})`;
  }

  responsavelSetor(nome: string): string {
    return this.chamados.find((chamado) => chamado.responsavel === nome)?.setor || 'Sem setor';
  }

  iniciais(nome: string): string {
    return nome.split(' ').filter(Boolean).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase();
  }

  maiorTotalColaborador(): number { return Math.max(...this.colaboradores.map((colaborador) => colaborador.total), 1); }
  statusClasse(status: Chamado['status']): string { return status.toLowerCase().replace(' ', '-'); }
}
