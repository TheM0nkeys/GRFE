import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChamadoService } from '../../../../services/chamado-service.service';
import { Chamado } from '../../../../models/chamado';

@Component({
  selector: 'app-chamado-view',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './chamado-view.component.html',
  styleUrls: ['./chamado-view.component.scss']
})
export class ChamadoViewComponent {
  chamados: Chamado[] = [];

  constructor(private readonly chamadoService: ChamadoService) {
    this.chamadoService.obterChamados().subscribe((chamados) => this.chamados = chamados);
  }

  get total(): number { return this.chamados.length; }
  get abertos(): number { return this.chamados.filter((chamado) => chamado.status === 'Aberto').length; }
  get andamento(): number { return this.chamados.filter((chamado) => chamado.status === 'Em andamento').length; }
  get resolvidos(): number { return this.chamados.filter((chamado) => chamado.status === 'Resolvido').length; }
  get criticos(): number { return this.chamados.filter((chamado) => chamado.severidade === 'Crítica').length; }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

}
