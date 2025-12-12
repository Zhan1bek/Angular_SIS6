import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth';
import { of } from 'rxjs';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      currentUser$: of(null)
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should allow access when user is authenticated', (done) => {
    Object.defineProperty(mockAuthService, 'currentUser$', {
      value: of({ uid: 'test-uid', email: 'test@test.com' })
    });

    const guard = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
    
    if (guard instanceof Promise) {
      guard.then(result => {
        expect(result).toBe(true);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    } else if (typeof guard === 'object' && guard && 'subscribe' in guard) {
      (guard as any).subscribe((result: boolean) => {
        expect(result).toBe(true);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    } else {
      expect(guard).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    }
  });

  it('should redirect to login when user is not authenticated', (done) => {
    Object.defineProperty(mockAuthService, 'currentUser$', {
      value: of(null)
    });

    const guard = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
    
    if (guard instanceof Promise) {
      guard.then(result => {
        expect(result).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    } else if (typeof guard === 'object' && guard && 'subscribe' in guard) {
      (guard as any).subscribe((result: boolean) => {
        expect(result).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    } else {
      expect(guard).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      done();
    }
  });
});

