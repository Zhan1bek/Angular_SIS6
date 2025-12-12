import { TestBed } from '@angular/core/testing';
import { UserProfileService } from './user-profile';

describe('UserProfileService', () => {
  let service: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have getUserProfile method', () => {
    expect(service.getUserProfile).toBeDefined();
    expect(typeof service.getUserProfile).toBe('function');
  });

  it('should have updatePhoto method', () => {
    expect(service.updatePhoto).toBeDefined();
    expect(typeof service.updatePhoto).toBe('function');
  });

  it('should return observable from getUserProfile', () => {
    const result = service.getUserProfile('test-uid');
    expect(result).toBeDefined();
    expect(result.subscribe).toBeDefined();
  });
});
