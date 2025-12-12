import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ((!navigator.onLine || error.status === 0) && 
          error.url?.includes('api.spacexdata.com') &&
          !error.url?.includes('favicon.ico')) {
        // Если это запрос к списку/деталям запусков или избранному — остаёмся на странице,
        // чтобы показать кэш или ошибку, без редиректа.
        const isDataFetch = req.url.includes('/launches');
        const isFavoritesFetch = req.url.includes('/favorites');
        const currentUrl = router.url;
        const isOfflinePage = currentUrl === '/offline' || currentUrl.startsWith('/offline');

        if (!isDataFetch && !isFavoritesFetch && !isOfflinePage) {
          setTimeout(() => {
            router.navigate(['/offline'], { 
              queryParams: { from: currentUrl },
              skipLocationChange: false 
            });
          }, 100);
        }
      }
      return throwError(() => error);
    })
  );
};
