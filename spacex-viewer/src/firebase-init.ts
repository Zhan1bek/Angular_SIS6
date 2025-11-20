// src/firebase-init.ts
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';

// создаём дефолтное Firebase App
export const firebaseApp = initializeApp(environment.firebase);
