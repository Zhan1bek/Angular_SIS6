import { Injectable } from '@angular/core';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { auth } from '../../firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    // слушаем изменения авторизации
    onAuthStateChanged(auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  async signup(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Firebase signup error:', error);
      throw new Error(this.mapFirebaseError(error));
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Firebase login error:', error);
      throw new Error(this.mapFirebaseError(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Firebase logout error:', error);
      throw new Error('Failed to logout. Try again.');
    }
  }

  private mapFirebaseError(error: any): string {
    const code = error?.code;

    switch (code) {
      case 'auth/email-already-in-use':
        return 'Этот email уже используется.';
      case 'auth/invalid-email':
        return 'Неверный формат email.';
      case 'auth/weak-password':
        return 'Слишком простой пароль (минимум 6 символов).';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Неверный email или пароль.';
      default:
        return `Произошла ошибка (${code || 'unknown'}). Попробуйте ещё раз.`;
    }
  }
}
