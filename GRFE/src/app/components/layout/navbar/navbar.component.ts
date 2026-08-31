import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
@Component({
  selector: 'app-navbar',
  imports: [RouterOutlet, MdbDropdownModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    isOpen = false;

    toggleMenu(): void {
      this.isOpen = !this.isOpen;
    }
}
