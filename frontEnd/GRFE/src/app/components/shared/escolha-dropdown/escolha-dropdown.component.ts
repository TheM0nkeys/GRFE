import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface EscolhaDropdownOption {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-escolha-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './escolha-dropdown.component.html',
  styleUrl: './escolha-dropdown.component.scss'
})
export class EscolhaDropdownComponent implements OnChanges {
  @Input() options: EscolhaDropdownOption[] = [];
  @Input() selectedId: number | null = null;
  @Input() placeholder = 'Digite para pesquisar';
  @Input() required = false;
  @Output() selectedIdChange = new EventEmitter<number | null>();

  query = '';
  aberto = false;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  get opcoesFiltradas(): EscolhaDropdownOption[] {
    const termo = this.query.trim().toLocaleLowerCase();
    return termo
      ? this.options.filter((option) => option.nome.toLocaleLowerCase().includes(termo))
      : this.options;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedId'] || changes['options']) {
      const selecionada = this.options.find((option) => option.id === this.selectedId);
      if (selecionada && !this.aberto) {
        this.query = selecionada.nome;
      }
    }
  }

  abrir(): void {
    this.aberto = true;
  }

  pesquisar(): void {
    this.aberto = true;
    if (!this.query.trim()) {
      this.selectedIdChange.emit(null);
    }
  }

  selecionar(option: EscolhaDropdownOption): void {
    this.query = option.nome;
    this.aberto = false;
    this.selectedIdChange.emit(option.id);
  }

  limpar(): void {
    this.query = '';
    this.aberto = true;
    this.selectedIdChange.emit(null);
  }

  @HostListener('document:click', ['$event'])
  fecharAoClicarFora(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.aberto = false;
      const selecionada = this.options.find((option) => option.id === this.selectedId);
      this.query = selecionada?.nome ?? '';
    }
  }
}
