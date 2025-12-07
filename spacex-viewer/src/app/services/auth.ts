import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '../../firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoData?: string | null;
  favorites?: string[];
  createdAt?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      this.userSubject.next(user);
      if (user) {
        await this.ensureUserDoc(user).catch(() => {});
      }
    });
  }

  async signup(email: string, password: string): Promise<void> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await this.ensureUserDoc(cred.user);
  }

  async login(email: string, password: string): Promise<void> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await this.ensureUserDoc(cred.user);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }


  get currentUser(): User | null {
    return this.userSubject.value;
  }


  private async ensureUserDoc(user: User): Promise<void> {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const appUser: AppUser = {
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoData: null,
        favorites: [],
        createdAt: serverTimestamp(),
      };

      await setDoc(ref, appUser);
    }
  }
}
