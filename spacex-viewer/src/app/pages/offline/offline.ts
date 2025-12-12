import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-offline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offline.html',
  styleUrl: './offline.css',
})
export class OfflinePage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isOffline = true;
  retryCount = 0;
  previousUrl: string | null = null;
  cachedItemsCount = 0;
  hasCachedData = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cacheService: CacheService
  ) {
    this.isOffline = !navigator.onLine;
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      this.previousUrl = params['from'] || null;
    });

    await this.checkCachedData();

    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private async checkCachedData(): Promise<void> {
    try {
      const cache = await caches.open('spacex-api-cache-v1');
      const keys = await cache.keys();
      this.cachedItemsCount = keys.length;
      this.hasCachedData = keys.length > 0;
    } catch {
      this.hasCachedData = false;
      this.cachedItemsCount = 0;
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
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);
  };

  private handleOffline = () => {
    this.isOffline = true;
  };

  async checkConnection() {
    this.retryCount++;
    
    try {
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      
      if (navigator.onLine) {
        this.isOffline = false;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 500);
      }
    } catch {
      this.isOffline = true;
    }
  }

  goToCachedPage(route: string) {
    this.router.navigate([route]);
  }

  goBack() {
    if (this.previousUrl) {
      this.router.navigate([this.previousUrl]);
    } else {
      this.router.navigate(['/']);
    }
  }
}

