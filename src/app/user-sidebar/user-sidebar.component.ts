import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-user-sidebar',
    standalone: true,
    imports: [CommonModule,RouterLink, RouterLinkActive],
    templateUrl: './user-sidebar.component.html',
    styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent {
  activeTab = 'profile';
  private authService = inject(AuthService);
  private router = inject(Router);

  setActive(tab: string) {
    this.activeTab = tab;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}