import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { App } from './app';
import { AuthService } from './services/auth';
import { NotificationService } from './services/notification.service';
import { of } from 'rxjs';

describe('App', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: of(null)
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], {
      url: '/'
    });
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    mockActivatedRoute = {
      snapshot: {},
      paramMap: of({}),
      queryParamMap: of({})
    };

    // Mock navigator for service worker
    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: {
        addEventListener: jasmine.createSpy('addEventListener'),
        ready: Promise.resolve({})
      }
    });

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have user$ observable', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.user$).toBeDefined();
  });

  it('should initialize offline status', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.isOffline).toBeDefined();
  });

  it('should handle logout', async () => {
    mockAuthService.logout.and.returnValue(Promise.resolve());
    
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    await app.onLogout();
    
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should have title method', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.title()).toBe('Spacex Viewer');
  });

  it('should handle online event', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const initialOffline = app.isOffline;
    
    window.dispatchEvent(new Event('online'));
    
    expect(app.isOffline).toBe(false);
  });

  it('should handle offline event', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    window.dispatchEvent(new Event('offline'));
    
    expect(app.isOffline).toBe(true);
  });

  it('should setup notification click handler', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    app.ngOnInit();
    
    expect(navigator.serviceWorker.addEventListener).toHaveBeenCalled();
  });
});
