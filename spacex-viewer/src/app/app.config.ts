import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { itemsReducer, ITEMS_FEATURE_KEY } from './items/state/items.reducer';
import { ItemsEffects } from './items/state/items.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    provideStore({
      [ITEMS_FEATURE_KEY]: itemsReducer,
    }),
    provideEffects([ItemsEffects]),
    provideStoreDevtools(),
  ],
};
