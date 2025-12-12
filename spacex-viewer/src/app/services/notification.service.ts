import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private permissionSubject = new BehaviorSubject<NotificationPermission>(
    'default' as NotificationPermission
  );
  permission$ = this.permissionSubject.asObservable();

  private isSupported = 'Notification' in window;

  constructor() {
    if (this.isSupported) {
      this.permissionSubject.next(Notification.permission);
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionSubject.next(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isPermissionGranted) {
      const granted = await this.requestPermission();
      if (!granted) {
        return;
      }
    }

    const notificationOptions: NotificationOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      requireInteraction: false,
      ...options
    };

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, notificationOptions);
      } catch (error) {
        console.error('Error showing notification via service worker:', error);
        new Notification(title, notificationOptions);
      }
    } else {
      new Notification(title, notificationOptions);
    }
  }

  async showNewLaunchNotification(launchName: string, launchId: string): Promise<void> {
    await this.showNotification('New SpaceX Launch!', {
      body: `${launchName} is now available`,
      tag: `launch-${launchId}`,
      data: {
        url: `/items/${launchId}`,
        id: launchId
      }
    });
  }

  get isPermissionGranted(): boolean {
    return this.isSupported && Notification.permission === 'granted';
  }

  get isPermissionDenied(): boolean {
    return this.isSupported && Notification.permission === 'denied';
  }

  get isSupportedBrowser(): boolean {
    return this.isSupported;
  }
}

