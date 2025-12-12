import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let mockCache: jasmine.SpyObj<Cache>;

  beforeEach(() => {
    mockCache = jasmine.createSpyObj('Cache', ['match', 'put', 'keys']);
    
    Object.defineProperty(window, 'caches', {
      writable: true,
      value: {
        open: jasmine.createSpy('open').and.returnValue(Promise.resolve(mockCache)),
        keys: jasmine.createSpy('keys').and.returnValue(Promise.resolve(['spacex-api-cache-v1'])),
        delete: jasmine.createSpy('delete').and.returnValue(Promise.resolve(true))
      }
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get cache', async () => {
    const cache = await service.getCache();
    expect(cache).toBeDefined();
    expect(window.caches.open).toHaveBeenCalledWith('spacex-api-cache-v1');
  });

  it('should get cached response', async () => {
    const mockResponse = new Response(JSON.stringify({ test: 'data' }));
    mockCache.match.and.returnValue(Promise.resolve(mockResponse));
    
    const result = await service.getCachedResponse('https://api.test.com', { query: 'test' });
    
    expect(result).toBe(mockResponse);
    expect(mockCache.match).toHaveBeenCalled();
  });

  it('should return null if no cached response', async () => {
    mockCache.match.and.returnValue(Promise.resolve(undefined));
    
    const result = await service.getCachedResponse('https://api.test.com', { query: 'test' });
    
    expect(result).toBeNull();
  });

  it('should set cached response', async () => {
    const mockResponse = new Response(JSON.stringify({ test: 'data' }));
    mockResponse.clone = jasmine.createSpy('clone').and.returnValue(mockResponse);
    mockCache.put.and.returnValue(Promise.resolve());
    
    await service.setCachedResponse('https://api.test.com', { query: 'test' }, mockResponse);
    
    expect(mockCache.put).toHaveBeenCalled();
  });

  it('should clear cache', async () => {
    await service.clearCache();
    
    expect(window.caches.keys).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockCache.match.and.returnValue(Promise.reject(new Error('Cache error')));
    
    const result = await service.getCachedResponse('https://api.test.com', { query: 'test' });
    
    expect(result).toBeNull();
  });

  it('should handle cache open errors', async () => {
    (window.caches.open as jasmine.Spy).and.returnValue(Promise.reject(new Error('Cache open error')));
    
    try {
      await service.getCache();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should create cache key with body', () => {
    const url = 'https://api.test.com';
    const body = { query: 'test' };
    
    const result = service.getCachedResponse(url, body);
    
    expect(mockCache.match).toHaveBeenCalled();
  });

  it('should create cache key without body', () => {
    const url = 'https://api.test.com';
    
    const result = service.getCachedResponse(url, null);
    
    expect(mockCache.match).toHaveBeenCalled();
  });

  it('should handle setCachedResponse errors', async () => {
    const mockResponse = new Response(JSON.stringify({ test: 'data' }));
    mockResponse.clone = jasmine.createSpy('clone').and.returnValue(mockResponse);
    mockCache.put.and.returnValue(Promise.reject(new Error('Put error')));
    
    await service.setCachedResponse('https://api.test.com', { query: 'test' }, mockResponse);
    
    expect(mockCache.put).toHaveBeenCalled();
  });

  it('should handle clearCache errors', async () => {
    (window.caches.keys as jasmine.Spy).and.returnValue(Promise.reject(new Error('Keys error')));
    
    await service.clearCache();
    
    expect(window.caches.keys).toHaveBeenCalled();
  });
});

