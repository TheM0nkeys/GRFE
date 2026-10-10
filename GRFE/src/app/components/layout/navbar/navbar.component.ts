import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';

@Component({
  selector: 'app-navbar',
  imports: [RouterOutlet, MdbDropdownModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    menuAberto = false;

    @ViewChild('menuWrapper') menuWrapper!: ElementRef<HTMLElement>;

    toggleMenu(): void {
      this.menuAberto = !this.menuAberto;
    }

    @HostListener('document:click', ['$event'])
    fecharAoClicarFora(event: MouseEvent): void {
      if (this.menuAberto && this.menuWrapper && !this.menuWrapper.nativeElement.contains(event.target as Node)) {
        this.menuAberto = false;
      }
    }

    @HostListener('window:scroll')
    fecharAoRolar(): void {
      this.menuAberto = false;
    }
}
