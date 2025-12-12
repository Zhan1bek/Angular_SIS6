import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';

import { AuthService } from '../../services/auth';
import {
  UserProfile,
  UserProfileService,
} from '../../services/user-profile';
import { ImageCompressionService } from '../../services/image-compression.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  private userProfileService = inject(UserProfileService);
  private imageCompressionService = inject(ImageCompressionService);
  notificationService = inject(NotificationService);

  user$ = this.auth.currentUser$;

  profile$ = this.user$.pipe(
    switchMap((user) => {
      if (!user) return of(null);
      return this.userProfileService.getUserProfile(user.uid);
    })
  );

  uploading = false;
  uploadError: string | null = null;

  async onLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.uploadError = null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Please choose an image file (jpg or png).';
      return;
    }

    const user = this.auth.currentUser;
    if (!user) {
      this.uploadError = 'You must be logged in to upload a photo.';
      return;
    }

    this.uploading = true;

    try {
      const dataUrl = await this.imageCompressionService.compressImage(file, {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.7
      });
      await this.userProfileService.updatePhoto(user.uid, dataUrl);
    } catch (err: any) {
      console.error(err);
      this.uploadError = err?.message || 'Failed to upload image.';
    } finally {
      this.uploading = false;
      input.value = '';
    }
  }

  async toggleNotifications() {
    if (this.notificationService.isPermissionGranted) {
      await this.testNotification();
    } else {
      const granted = await this.notificationService.requestPermission();
      if (granted) {
        await this.testNotification();
      }
    }
  }

  private async testNotification() {
    await this.notificationService.showNotification('Notifications enabled!', {
      body: 'You will receive notifications about new SpaceX launches.',
      tag: 'notification-enabled'
    });
  }

  ngOnDestroy(): void {
    this.imageCompressionService.terminate();
  }
}
