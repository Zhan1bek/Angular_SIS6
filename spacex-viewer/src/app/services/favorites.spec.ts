import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FavoritesService } from './favorites';
import { AuthService } from './auth';
import { NotificationService } from './notification.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      currentUser$: of(null)
    });
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['showNotification'], {
      isSupportedBrowser: true
    });

    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    });
    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have favorites$ observable', () => {
    expect(service.favorites$).toBeDefined();
  });

  it('should toggle favorite', () => {
    expect(service.isFavorite('item1')).toBe(false);
    
    service.toggleFavorite('item1');
    expect(service.isFavorite('item1')).toBe(true);
    
    service.toggleFavorite('item1');
    expect(service.isFavorite('item1')).toBe(false);
  });

  it('should save to localStorage for guests', () => {
    service.toggleFavorite('item1');
    service.toggleFavorite('item2');
    
    const stored = localStorage.getItem('spacex_favorites');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toContain('item1');
    expect(parsed).toContain('item2');
  });

  it('should load from localStorage', () => {
    localStorage.setItem('spacex_favorites', JSON.stringify(['item1', 'item2']));
    
    const service2 = TestBed.inject(FavoritesService);
    expect(service2.isFavorite('item1')).toBe(true);
    expect(service2.isFavorite('item2')).toBe(true);
  });

  it('should get current favorites', () => {
    service.toggleFavorite('item1');
    expect(service.currentFavorites).toContain('item1');
  });

  it('should clear merge info', () => {
    service.clearMergeInfo();
    service.mergeInfo$.subscribe(info => {
      expect(info).toBeNull();
    });
  });
});
