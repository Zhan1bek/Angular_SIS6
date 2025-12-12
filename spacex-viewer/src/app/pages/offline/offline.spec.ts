import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { OfflinePage } from './offline';
import { CacheService } from '../../services/cache.service';

describe('OfflinePage', () => {
  let component: OfflinePage;
  let fixture: ComponentFixture<OfflinePage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: any;
  let mockCacheService: jasmine.SpyObj<CacheService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRoute = {
      queryParams: of({ from: '/items' })
    };
    mockCacheService = jasmine.createSpyObj('CacheService', ['getCache']);

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    Object.defineProperty(window, 'caches', {
      writable: true,
      value: {
        open: jasmine.createSpy('open').and.returnValue(Promise.resolve({
          keys: jasmine.createSpy('keys').and.returnValue(Promise.resolve([
            new Request('https://api.spacexdata.com/v5/launches/query')
          ]))
        }))
      }
    });

    await TestBed.configureTestingModule({
      imports: [OfflinePage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: CacheService, useValue: mockCacheService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check connection', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
    
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({} as Response));
    
    await component.checkConnection();
    
    expect(component.retryCount).toBeGreaterThan(0);
  });

  it('should go to cached page', () => {
    component.goToCachedPage('/items');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/items']);
  });

  it('should go back to previous URL', () => {
    component.previousUrl = '/items';
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/items']);
  });

  it('should go to home if no previous URL', () => {
    component.previousUrl = null;
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});

