import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RelatorioDados } from '../../../../models/relatorio';
import { RelatorioService } from '../../../../services/relatorio-service.service';

@Component({
  selector: 'app-relatorios',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent {
  dados?: RelatorioDados;
  carregando = true;
  erro = false;

  constructor(private readonly relatorioService: RelatorioService) {
    this.relatorioService.obterDados().subscribe({
      next: (dados) => {
        this.dados = dados;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.erro = true;
      }
    });
  }

  exportarCsv(): void {
    if (this.dados) {
      this.relatorioService.gerarCsv(this.dados);
    }
  }

}
