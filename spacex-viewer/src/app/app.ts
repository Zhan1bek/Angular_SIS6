import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth';
import { NotificationService } from './services/notification.service';
import { UserProfileService } from './services/user-profile';
import { I18nService } from './services/i18n.service';
import { LanguageSelectorComponent } from './components/language-selector/language-selector';
import { Subject, of } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, LanguageSelectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private userProfileService = inject(UserProfileService);
  public i18n = inject(I18nService);
  private destroy$ = new Subject<void>();

  user$ = this.auth.currentUser$;
  profile$ = this.user$.pipe(
    switchMap((user) => {
      if (!user) return of(null);
      return this.userProfileService.getUserProfile(user.uid);
    })
  );
  isOffline = false;

  ngOnInit(): void {
    this.isOffline = !navigator.onLine;
    
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    this.setupNotificationClickHandler();
    
    // Set initial document language
    document.documentElement.lang = this.i18n.currentLanguageValue;
  }

  private setupNotificationClickHandler(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
          const url = event.data.url || '/';
          this.router.navigateByUrl(url);
        }
      });
    }
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
