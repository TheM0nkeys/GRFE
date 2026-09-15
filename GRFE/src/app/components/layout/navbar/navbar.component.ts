import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
@Component({
  selector: 'app-navbar',
  imports: [RouterOutlet, MdbDropdownModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    isOpen = false;

    constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

    toggleMenu(): void {
      this.isOpen = !this.isOpen;
    }

    @HostListener('document:click', ['$event'])
    fecharAoClicarFora(event: MouseEvent): void {
      if (this.isOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
        this.isOpen = false;
      }
    }

    @HostListener('window:scroll')
    fecharAoRolar(): void {
      this.isOpen = false;
    }
}
