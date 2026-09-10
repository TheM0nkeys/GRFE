import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RelatorioDados } from '../../../../../models/relatorio';
import { RelatorioService } from '../../../../../services/relatorio-service.service';

@Component({
  selector: 'app-relatorios',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent {
  dados?: RelatorioDados;

  constructor(private readonly relatorioService: RelatorioService) {
    this.relatorioService.obterDados().subscribe((dados) => {
      this.dados = dados;
    });
  }

  exportarCsv(): void {
    if (this.dados) {
      this.relatorioService.gerarCsv(this.dados);
    }
  }

}
