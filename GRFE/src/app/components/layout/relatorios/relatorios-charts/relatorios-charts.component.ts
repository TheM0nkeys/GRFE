import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { RelatorioDados } from '../../../../models/relatorio';
import { RelatorioService } from '../../../../services/relatorio-service.service';

Chart.register(...registerables);

@Component({
  selector: 'app-relatorios-charts',
  imports: [CommonModule],
  templateUrl: './relatorios-charts.component.html',
  styleUrl: './relatorios-charts.component.scss'
})
export class RelatoriosChartsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tendenciaChart') tendenciaChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('semanasChart') semanasChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('setoresChart') setoresChart?: ElementRef<HTMLCanvasElement>;

  dados?: RelatorioDados;
  carregando = true;
  erro = false;
  private charts: Chart[] = [];

  constructor(
    private readonly relatorioService: RelatorioService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.relatorioService.obterDados().subscribe({
      next: (dados) => {
        this.dados = dados;
        this.carregando = false;
        this.changeDetector.detectChanges();
        this.criarGraficos();
      },
      error: () => {
        this.carregando = false;
        this.erro = true;
        this.changeDetector.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.charts.forEach((chart) => chart.destroy());
  }

  private criarGraficos(): void {
    if (!this.dados || !this.tendenciaChart || !this.semanasChart || !this.setoresChart) {
      return;
    }

    const eixo: any = {
      color: '#687b96',
      border: { display: false },
      grid: { color: '#d7e1ef', borderDash: [3, 3] }
    };

    this.charts = [
      new Chart(this.tendenciaChart.nativeElement, {
        type: 'line',
        data: {
          labels: this.dados.tendenciaMensal.labels,
          datasets: [
            { label: 'Críticos', data: this.dados.tendenciaMensal.criticos, borderColor: '#df4d3f', backgroundColor: '#df4d3f', pointBackgroundColor: '#fff', pointBorderWidth: 2, tension: 0, borderWidth: 2 },
            { label: 'Resolvidos', data: this.dados.tendenciaMensal.resolvidos, borderColor: '#08a47d', backgroundColor: '#08a47d', pointBackgroundColor: '#fff', pointBorderWidth: 2, tension: 0, borderWidth: 2 },
            { label: 'Total', data: this.dados.tendenciaMensal.total, borderColor: '#244b82', backgroundColor: '#244b82', pointBackgroundColor: '#fff', pointBorderWidth: 2, tension: 0, borderWidth: 2 }
          ]
        },
        options: this.opcoesLinha(eixo)
      }),
      new Chart(this.semanasChart.nativeElement, {
        type: 'bar',
        data: { labels: this.dados.incidentesPorSemana.labels, datasets: [{ label: 'Incidentes', data: this.dados.incidentesPorSemana.valores, backgroundColor: '#244b82', borderRadius: 3, barPercentage: 0.78 }] },
        options: this.opcoesBarra(eixo)
      }),
      new Chart(this.setoresChart.nativeElement, {
        type: 'bar',
        data: { labels: this.dados.incidentesPorSetor.labels, datasets: this.dados.incidentesPorSetor.datasets.map((dataset) => ({ ...dataset, borderRadius: 0, barPercentage: 0.8 })) },
        options: { ...this.opcoesBarra(eixo), scales: { x: { ...eixo, stacked: true }, y: { ...eixo, stacked: true, beginAtZero: true } } }
      })
    ];
  }

  private opcoesLinha(eixo: any): any {
    return { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 6, padding: 18, color: '#31527d' } } }, scales: { x: eixo, y: { ...eixo, beginAtZero: true, ticks: { stepSize: 2 } } } };
  }

  private opcoesBarra(eixo: any): any {
    return { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: eixo, y: { ...eixo, beginAtZero: true, ticks: { stepSize: 1 } } } };
  }
}
