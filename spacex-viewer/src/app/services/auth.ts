import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  // текущий пользователь (null, если не залогинен)
  currentUser$: Observable<User | null> = authState(this.auth);

  async signup(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      throw new Error(this.mapFirebaseError(error));
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      throw new Error(this.mapFirebaseError(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch {
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
        return 'Произошла ошибка. Попробуйте ещё раз.';
    }
  }
}
