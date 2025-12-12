import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {docData} from '@angular/fire/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string | null;
  favorites?: string[];
  photoData?: string | null;
  createdAt?: any;
}

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {

  getUserProfile(uid: string): Observable<UserProfile | null> {
    const ref = doc(db, 'users', uid);
    return docData(ref, { idField: 'uid' }) as Observable<UserProfile | null>;
  }

  async updatePhoto(uid: string, photoData: string): Promise<void> {
    const ref = doc(db, 'users', uid);
    await setDoc(
      ref,
      { photoData },
      { merge: true }
    );
  }
}
