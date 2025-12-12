import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {map, Observable, throwError, from, of} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {Launch} from '../models/launch';
import {CacheService} from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class SpacexService {
  private base = 'https://api.spacexdata.com/v5';

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) {}

  getLaunches(limit = 30, page = 1) : Observable<{docs: Launch[], totalDocs: number, page: number, limit: number}> {
    const body = {
      query: {},
      options:{
        sort: { date_utc: 'desc' },
        limit,
        page
      }
    };

    const url = `${this.base}/launches/query`;

    return this.http.post<{docs: Launch[], totalDocs: number, page: number, limit: number}>(url, body).pipe(
      tap(async response => {
        try {
          const cachedResponse = Response.json(response);
          await this.cacheService.setCachedResponse(url, body, cachedResponse);
        } catch {
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine || error.status === 0) {
          return from(this.cacheService.getCachedResponse(url, body)).pipe(
            switchMap(cached => {
              if (cached) {
                return from(cached.json()) as Observable<{docs: Launch[], totalDocs: number, page: number, limit: number}>;
              }
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  searchLaunches(term: string, successOnly = false, limit = 30, page = 1) : Observable<{docs: Launch[], totalDocs: number, page: number, limit: number}> {
    const query:any = {};
    if (term && term.trim().length > 0) {
      query.name = {$regex: term.trim(), $options: 'i'}
    }
    if (successOnly) {
      query.success = true
    }

    const body = {
      query,
      options:{
        sort: { date_utc: 'desc' },
        limit,
        page
      }
    };

    const url = `${this.base}/launches/query`;

    return this.http.post<{docs: Launch[], totalDocs: number, page: number, limit: number}>(url, body).pipe(
      tap(async response => {
        try {
          const cachedResponse = Response.json(response);
          await this.cacheService.setCachedResponse(url, body, cachedResponse);
        } catch {
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine || error.status === 0) {
          return from(this.cacheService.getCachedResponse(url, body)).pipe(
            switchMap(cached => {
              if (cached) {
                return from(cached.json()) as Observable<{docs: Launch[], totalDocs: number, page: number, limit: number}>;
              }
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  getLaunch(id: string): Observable<Launch> {
    const url = `${this.base}/launches/${id}`;
    
    return this.http.get<Launch>(url).pipe(
      tap(response => {
        try {
          const cachedResponse = Response.json(response);
          this.cacheService.setCachedResponse(url, null, cachedResponse).catch(() => {});
        } catch {
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine || error.status === 0) {
          return from(this.cacheService.getCachedResponse(url, null)).pipe(
            switchMap(cached => {
              if (cached) {
                return from(cached.json()) as Observable<Launch>;
              }
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  getRocket(id: string): Observable<{ id: string; name: string }> {
    const url = `${this.base}/rockets/${id}`;
    
    return this.http.get<{ id: string; name: string }>(url).pipe(
      tap(response => {
        try {
          const cachedResponse = Response.json(response);
          this.cacheService.setCachedResponse(url, null, cachedResponse).catch(() => {});
        } catch {
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine || error.status === 0) {
          return from(this.cacheService.getCachedResponse(url, null)).pipe(
            switchMap(cached => {
              if (cached) {
                return from(cached.json()) as Observable<{ id: string; name: string }>;
              }
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  getLaunchpad(id: string): Observable<{ id: string; name: string; locality: string }> {
    const url = `${this.base}/launchpads/${id}`;
    
    return this.http.get<{ id: string; name: string; locality: string }>(url).pipe(
      tap(response => {
        try {
          const cachedResponse = Response.json(response);
          this.cacheService.setCachedResponse(url, null, cachedResponse).catch(() => {});
        } catch {
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine || error.status === 0) {
          return from(this.cacheService.getCachedResponse(url, null)).pipe(
            switchMap(cached => {
              if (cached) {
                return from(cached.json()) as Observable<{ id: string; name: string; locality: string }>;
              }
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }


}
