import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  user$ = this.auth.currentUser$;
  isOffline = false;

  ngOnInit(): void {
    this.isOffline = !navigator.onLine;
    
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleOnline = () => {
    this.isOffline = false;
  };

  private handleOffline = () => {
    this.isOffline = true;
  };

  title() {
    return 'Spacex Viewer';
  }

  async onLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
