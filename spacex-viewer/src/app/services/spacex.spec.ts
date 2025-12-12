import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { SpacexService } from './spacex';
import { CacheService } from './cache.service';

describe('SpacexService', () => {
  let service: SpacexService;
  let mockCacheService: jasmine.SpyObj<CacheService>;

  beforeEach(() => {
    mockCacheService = jasmine.createSpyObj('CacheService', ['getCachedResponse', 'setCachedResponse']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CacheService, useValue: mockCacheService }
      ]
    });
    service = TestBed.inject(SpacexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have getLaunches method', () => {
    expect(service.getLaunches).toBeDefined();
    expect(typeof service.getLaunches).toBe('function');
  });

  it('should have searchLaunches method', () => {
    expect(service.searchLaunches).toBeDefined();
    expect(typeof service.searchLaunches).toBe('function');
  });

  it('should have getLaunch method', () => {
    expect(service.getLaunch).toBeDefined();
    expect(typeof service.getLaunch).toBe('function');
  });

  it('should have getRocket method', () => {
    expect(service.getRocket).toBeDefined();
    expect(typeof service.getRocket).toBe('function');
  });

  it('should have getLaunchpad method', () => {
    expect(service.getLaunchpad).toBeDefined();
    expect(typeof service.getLaunchpad).toBe('function');
  });
});
