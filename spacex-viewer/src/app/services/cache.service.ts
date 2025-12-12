import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly CACHE_NAME = 'spacex-api-cache';
  private readonly CACHE_VERSION = 'v1';

  async getCache(): Promise<Cache> {
    return await caches.open(`${this.CACHE_NAME}-${this.CACHE_VERSION}`);
  }

  async getCachedResponse(url: string, body: any): Promise<Response | null> {
    try {
      const cache = await this.getCache();
      const cacheKey = this.createCacheKey(url, body);
      const response = await cache.match(cacheKey);
      return response || null;
    } catch {
      return null;
    }
  }

  async setCachedResponse(url: string, body: any, response: Response): Promise<void> {
    try {
      const cache = await this.getCache();
      const cacheKey = this.createCacheKey(url, body);
      const responseClone = response.clone();
      await cache.put(cacheKey, responseClone);
    } catch {
    }
  }

  private createCacheKey(url: string, body: any): string {
    if (body === null || body === undefined) {
      return url;
    }
    const bodyStr = JSON.stringify(body);
    return `${url}?body=${btoa(bodyStr)}`;
  }

  async clearCache(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      const spacexCaches = cacheNames.filter(name => name.startsWith(this.CACHE_NAME));
      await Promise.all(spacexCaches.map(name => caches.delete(name)));
    } catch {
    }
  }
}

