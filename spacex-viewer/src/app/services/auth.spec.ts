import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have currentUser$ observable', () => {
    expect(service.currentUser$).toBeDefined();
  });

  it('should have currentUser getter', () => {
    expect(service.currentUser).toBeDefined();
  });

  it('should have login method', () => {
    expect(service.login).toBeDefined();
    expect(typeof service.login).toBe('function');
  });

  it('should have signup method', () => {
    expect(service.signup).toBeDefined();
    expect(typeof service.signup).toBe('function');
  });

  it('should have logout method', () => {
    expect(service.logout).toBeDefined();
    expect(typeof service.logout).toBe('function');
  });
});
