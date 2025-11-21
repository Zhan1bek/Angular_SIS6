import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  user$ = this.auth.currentUser$;

  async onLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
