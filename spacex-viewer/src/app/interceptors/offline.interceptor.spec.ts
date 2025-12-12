import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { offlineInterceptor } from './offline.interceptor';

describe('offlineInterceptor', () => {
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should pass through successful requests', (done) => {
    const request = new HttpRequest('GET', 'https://api.spacexdata.com/v5/launches');
    const next = jasmine.createSpy('next').and.returnValue(of({}));

    const interceptor = TestBed.runInInjectionContext(() => offlineInterceptor(request, next));
    
    interceptor.subscribe(() => {
      expect(next).toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to offline page on network error for SpaceX API', (done) => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    const request = new HttpRequest('POST', 'https://api.spacexdata.com/v5/launches/query', {});
    const error = new HttpErrorResponse({
      status: 0,
      url: 'https://api.spacexdata.com/v5/launches/query'
    });
    const next = jasmine.createSpy('next').and.returnValue(throwError(() => error));

    const interceptor = TestBed.runInInjectionContext(() => offlineInterceptor(request, next));
    
    interceptor.subscribe({
      error: () => {
        setTimeout(() => {
          expect(mockRouter.navigate).toHaveBeenCalled();
          done();
        }, 150);
      }
    });
  });

  it('should not redirect for non-SpaceX API errors', (done) => {
    const request = new HttpRequest('GET', 'https://other-api.com/data');
    const error = new HttpErrorResponse({
      status: 404,
      url: 'https://other-api.com/data'
    });
    const next = jasmine.createSpy('next').and.returnValue(throwError(() => error));

    const interceptor = TestBed.runInInjectionContext(() => offlineInterceptor(request, next));
    
    interceptor.subscribe({
      error: () => {
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('should not redirect if already on offline page', (done) => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    Object.defineProperty(mockRouter, 'url', {
      writable: true,
      value: '/offline'
    });

    const request = new HttpRequest('POST', 'https://api.spacexdata.com/v5/launches/query', {});
    const error = new HttpErrorResponse({
      status: 0,
      url: 'https://api.spacexdata.com/v5/launches/query'
    });
    const next = jasmine.createSpy('next').and.returnValue(throwError(() => error));

    const interceptor = TestBed.runInInjectionContext(() => offlineInterceptor(request, next));
    
    interceptor.subscribe({
      error: () => {
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle online status with error', (done) => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });

    const request = new HttpRequest('POST', 'https://api.spacexdata.com/v5/launches/query', {});
    const error = new HttpErrorResponse({
      status: 0,
      url: 'https://api.spacexdata.com/v5/launches/query'
    });
    const next = jasmine.createSpy('next').and.returnValue(throwError(() => error));

    const interceptor = TestBed.runInInjectionContext(() => offlineInterceptor(request, next));
    
    interceptor.subscribe({
      error: () => {
        expect(mockRouter.navigate).toHaveBeenCalled();
        done();
      }
    });
  });
});

