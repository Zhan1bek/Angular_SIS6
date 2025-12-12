import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockRequestPermission: jasmine.Spy;
  let mockShowNotification: jasmine.Spy;
  let mockServiceWorkerRegistration: any;

  beforeEach(() => {
    // Setup mock Notification
    mockRequestPermission = jasmine.createSpy('requestPermission').and.returnValue(Promise.resolve('granted' as NotificationPermission));
    
    const MockNotification = class {
      constructor(public title: string, public options?: NotificationOptions) {}
      static requestPermission = mockRequestPermission;
    };
    
    Object.defineProperty(MockNotification, 'permission', {
      writable: true,
      configurable: true,
      value: 'granted' as NotificationPermission
    });
    
    Object.defineProperty(window, 'Notification', {
      writable: true,
      configurable: true,
      value: MockNotification
    });
    
    // Setup mock Service Worker
    mockShowNotification = jasmine.createSpy('showNotification').and.returnValue(Promise.resolve());
    mockServiceWorkerRegistration = {
      showNotification: mockShowNotification
    };
    
    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      configurable: true,
      value: {
        ready: Promise.resolve(mockServiceWorkerRegistration)
      }
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if browser supports notifications', () => {
    expect(service.isSupportedBrowser).toBeDefined();
  });

  it('should check permission status', () => {
    expect(service.isPermissionGranted).toBeDefined();
    expect(service.isPermissionDenied).toBeDefined();
  });

  it('should request permission', async () => {
    mockRequestPermission.and.returnValue(Promise.resolve('granted' as NotificationPermission));
    
    const result = await service.requestPermission();
    expect(result).toBe(true);
    expect(mockRequestPermission).toHaveBeenCalled();
  });

  it('should return false if permission is denied', async () => {
    mockRequestPermission.and.returnValue(Promise.resolve('denied' as NotificationPermission));
    
    const result = await service.requestPermission();
    expect(result).toBe(false);
    expect(mockRequestPermission).toHaveBeenCalled();
  });

  it('should show notification via service worker', async () => {
    Object.defineProperty(Notification, 'permission', {
      writable: true,
      configurable: true,
      value: 'granted'
    });
    
    await service.showNotification('Test Title', { body: 'Test Body' });
    
    expect(mockShowNotification).toHaveBeenCalledWith('Test Title', jasmine.objectContaining({ body: 'Test Body' }));
  });

  it('should show new launch notification', async () => {
    Object.defineProperty(Notification, 'permission', {
      writable: true,
      configurable: true,
      value: 'granted'
    });
    
    spyOn(service, 'showNotification').and.returnValue(Promise.resolve());
    
    await service.showNewLaunchNotification('Test Launch', 'test-id');
    
    expect(service.showNotification).toHaveBeenCalledWith(
      'New SpaceX Launch!',
      jasmine.objectContaining({
        body: 'Test Launch is now available',
        tag: 'launch-test-id'
      })
    );
  });

  it('should handle browser without notification support', () => {
    const originalNotification = window.Notification;
    delete (window as any).Notification;
    
    const newService = new NotificationService();
    expect(newService.isSupportedBrowser).toBe(false);
    
    // Restore
    (window as any).Notification = originalNotification;
  });

  it('should show notification directly if service worker not available', async () => {
    const NotificationSpy = jasmine.createSpy('Notification').and.returnValue({});
    Object.defineProperty(NotificationSpy, 'permission', {
      writable: true,
      configurable: true,
      value: 'granted'
    });
    
    Object.defineProperty(window, 'navigator', {
      writable: true,
      configurable: true,
      value: {
        ...navigator,
        serviceWorker: undefined
      }
    });
    
    Object.defineProperty(window, 'Notification', {
      writable: true,
      configurable: true,
      value: NotificationSpy
    });
    
    const newService = new NotificationService();
    await newService.showNotification('Test', { body: 'Test body' });
    
    expect(NotificationSpy).toHaveBeenCalled();
  });

  it('should request permission before showing notification', async () => {
    Object.defineProperty(Notification, 'permission', {
      writable: true,
      configurable: true,
      value: 'default'
    });
    mockRequestPermission.and.returnValue(Promise.resolve('granted' as NotificationPermission));
    
    await service.showNotification('Test');
    
    expect(mockRequestPermission).toHaveBeenCalled();
  });

  it('should not show notification if permission denied', async () => {
    Object.defineProperty(Notification, 'permission', {
      writable: true,
      configurable: true,
      value: 'default'
    });
    mockRequestPermission.and.returnValue(Promise.resolve('denied' as NotificationPermission));
    
    await service.showNotification('Test');
    
    expect(mockRequestPermission).toHaveBeenCalled();
    expect(mockShowNotification).not.toHaveBeenCalled();
  });
});

