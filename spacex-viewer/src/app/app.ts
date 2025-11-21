import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private auth = inject(AuthService);
  private router = inject(Router);

  user$ = this.auth.currentUser$;

  title() {
    return 'Spacex Viewer';
  }

  async onLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
