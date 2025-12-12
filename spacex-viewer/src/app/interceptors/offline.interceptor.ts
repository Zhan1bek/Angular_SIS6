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
        const currentUrl = router.url;
        if (currentUrl !== '/offline' && !currentUrl.startsWith('/offline')) {
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
