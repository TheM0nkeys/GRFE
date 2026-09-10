import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { Chamado, SeveridadeChamado, StatusChamado } from '../../../../../models/chamado';
import { ChamadoService } from '../../../../../services/chamado-service.service';

@Component({
  selector: 'app-chamados-list',
  imports: [CommonModule, FormsModule, RouterLink, MdbRippleModule],
  templateUrl: './chamados-list.component.html',
  styleUrls: ['./chamados-list.component.scss']
})
export class ChamadosListComponent {
  chamados: Chamado[] = [];
  busca = '';
  setor = 'Todos os setores';
  severidade = 'Todas severidades';
  status = 'Todos status';

  readonly setores = ['Todos os setores', 'Geração', 'Transmissão', 'Subestação', 'Manutenção Mecânica', 'Manutenção Elétrica', 'TI & Sistemas', 'Segurança', 'Civil'];
  readonly severidades = ['Todas severidades', 'Crítica', 'Alta', 'Média', 'Baixa'];
  readonly statusOptions = ['Todos status', 'Aberto', 'Em andamento', 'Resolvido'];

  constructor(private readonly chamadoService: ChamadoService) {
    this.chamadoService.obterChamados().subscribe((chamados) => this.chamados = chamados);
  }

  get chamadosFiltrados(): Chamado[] {
    const termo = this.busca.trim().toLowerCase();
    return this.chamados.filter((chamado) => {
      const correspondeBusca = !termo || [chamado.id, chamado.titulo, chamado.setor, chamado.responsavel, chamado.motivo].some((valor) => valor.toLowerCase().includes(termo));
      return correspondeBusca
        && (this.setor === 'Todos os setores' || chamado.setor === this.setor)
        && (this.severidade === 'Todas severidades' || chamado.severidade === this.severidade)
        && (this.status === 'Todos status' || chamado.status === this.status);
    });
  }

  getStatusClass(status: StatusChamado): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getSeverityClass(severidade: SeveridadeChamado): string {
    return severidade.toLowerCase().replace('í', 'i');
  }

  registrarIncidente(): void {
    console.log('[ChamadosList] Abrindo formulário de novo chamado');
  }

  abrirChamado(chamado: Chamado): void {
    console.log('[ChamadosList] Abrindo chamado:', chamado.id);
  }

}
