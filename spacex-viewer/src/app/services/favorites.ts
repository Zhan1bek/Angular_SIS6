import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { AuthService } from './auth';
import { NotificationService } from './notification.service';

interface UserDoc {
  favorites?: string[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'spacex_favorites';

  private favoritesSubject = new BehaviorSubject<string[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  private mergeInfoSubject = new BehaviorSubject<string | null>(null);
  mergeInfo$ = this.mergeInfoSubject.asObservable();

  private currentUserId: string | null = null;
  private mergedForUserId: string | null = null;

  constructor(
    private auth: AuthService,
    private notificationService: NotificationService
  ) {
    const local = this.loadFromLocalStorage();
    this.favoritesSubject.next(local);

    this.auth.currentUser$.subscribe((user) => {
      const prevUserId = this.currentUserId;
      this.currentUserId = user ? user.uid : null;

      if (!user) {
        this.mergedForUserId = null;
        const loc = this.loadFromLocalStorage();
        this.favoritesSubject.next(loc);
        return;
      }

      const firstLoginForThisUser = prevUserId === null || prevUserId !== user.uid;
      this.syncFromFirestore(user.uid, firstLoginForThisUser).catch((err) => {
        console.warn('[Favorites] Failed to sync from Firestore', err);
      });
    });
  }

  get currentFavorites(): string[] {
    return this.favoritesSubject.value;
  }

  isFavorite(id: string): boolean {
    return this.favoritesSubject.value.includes(id);
  }

  toggleFavorite(id: string): void {
    const current = this.favoritesSubject.value;
    const exists = current.includes(id);
    const updated = exists
      ? current.filter((x) => x !== id)
      : [...current, id];

    this.favoritesSubject.next(updated);
    this.saveToLocalStorage(updated);

    if (this.currentUserId) {
      this.saveToFirestore(this.currentUserId, updated).catch((err) => {
        console.warn('[Favorites] Failed to save to Firestore', err);
      });
    }

    // Notify only on add
    if (!exists && this.notificationService.isSupportedBrowser) {
      this.notificationService
        .showNotification('Added to favorites', {
          body: `Launch ${id} added to your favorites.`,
          tag: `fav-${id}`,
        })
        .catch(() => {});
    }
  }

  clearMergeInfo() {
    this.mergeInfoSubject.next(null);
  }

  private loadFromLocalStorage(): string[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }

  private saveToLocalStorage(favs: string[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favs));
    } catch {
    }
  }


  private async syncFromFirestore(uid: string, mayMergeLocal: boolean): Promise<void> {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);

    let serverFavorites: string[] = [];
    if (snap.exists()) {
      const data = snap.data() as UserDoc;
      if (Array.isArray(data.favorites)) {
        serverFavorites = data.favorites.filter((x) => typeof x === 'string');
      }
    }

    let finalFavorites = serverFavorites;

    if (mayMergeLocal && this.mergedForUserId !== uid) {
      const local = this.loadFromLocalStorage();
      if (local.length) {
        const merged = Array.from(new Set([...serverFavorites, ...local]));
        finalFavorites = merged;

        await setDoc(
          ref,
          {
            favorites: merged,
          },
          { merge: true }
        );

        this.mergedForUserId = uid;
        this.mergeInfoSubject.next(
          'Your local favorites have been synced with your account.'
        );
      }
    }

    this.favoritesSubject.next(finalFavorites);
    this.saveToLocalStorage(finalFavorites);
  }

  private async saveToFirestore(uid: string, favorites: string[]): Promise<void> {
    const ref = doc(db, 'users', uid);
    await setDoc(
      ref,
      {
        favorites,
      },
      { merge: true }
    );
  }
}
