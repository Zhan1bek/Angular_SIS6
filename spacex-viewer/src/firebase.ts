import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from './environments/environment';

const app = initializeApp(environment.firebase);

// Экспортируем один общий инстанс auth на всё приложение
export const auth = getAuth(app);
