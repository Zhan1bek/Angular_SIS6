import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';

import { AuthService } from '../../services/auth';
import {
  UserProfile,
  UserProfileService,
} from '../../services/user-profile';

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
  private userProfileService = inject(UserProfileService);

  // Firebase Auth user
  user$ = this.auth.currentUser$;

  // Профиль из Firestore (users/{uid})
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
      const dataUrl = await this.compressImage(file, 512, 512, 0.7);
      await this.userProfileService.updatePhoto(user.uid, dataUrl);
      // profile$ автоматически получит обновлённые данные
    } catch (err: any) {
      console.error(err);
      this.uploadError = err?.message || 'Failed to upload image.';
    } finally {
      this.uploading = false;
      // сброс input, чтобы можно было выбрать тот же файл заново
      input.value = '';
    }
  }

  /**
   * Простое сжатие картинки через canvas:
   * - уменьшает до maxWidth x maxHeight
   * - сохраняет в JPEG с quality
   * - возвращает data URL (string), который кладём в Firestore
   */
  private compressImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas is not supported.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to read image.'));

      img.src = URL.createObjectURL(file);
    });
  }
}
