import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProfileComponent } from './profile';
import { AuthService } from '../../services/auth';
import { UserProfileService } from '../../services/user-profile';
import { ImageCompressionService } from '../../services/image-compression.service';
import { NotificationService } from '../../services/notification.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserProfileService: jasmine.SpyObj<UserProfileService>;
  let mockImageCompressionService: jasmine.SpyObj<ImageCompressionService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: of({ uid: 'test-uid', email: 'test@test.com' }),
      currentUser: { uid: 'test-uid', email: 'test@test.com' }
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUserProfileService = jasmine.createSpyObj('UserProfileService', ['getUserProfile', 'updatePhoto'], {
      getUserProfile: jasmine.createSpy('getUserProfile').and.returnValue(of({ uid: 'test-uid', email: 'test@test.com' }))
    });
    mockImageCompressionService = jasmine.createSpyObj('ImageCompressionService', ['compressImage', 'terminate']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['requestPermission', 'showNotification'], {
      isPermissionGranted: false,
      isSupportedBrowser: true
    });

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: UserProfileService, useValue: mockUserProfileService },
        { provide: ImageCompressionService, useValue: mockImageCompressionService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have user$ observable', () => {
    expect(component.user$).toBeDefined();
  });

  it('should have profile$ observable', () => {
    expect(component.profile$).toBeDefined();
  });

  it('should handle logout', async () => {
    mockAuthService.logout.and.returnValue(Promise.resolve());
    
    await component.onLogout();
    
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle file selection', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    mockImageCompressionService.compressImage.and.returnValue(Promise.resolve('data:image/jpeg;base64,test'));
    mockUserProfileService.updatePhoto.and.returnValue(Promise.resolve());
    
    const event = {
      target: {
        files: [mockFile],
        value: ''
      }
    } as any;
    
    await component.onFileSelected(event);
    
    expect(mockImageCompressionService.compressImage).toHaveBeenCalled();
    expect(mockUserProfileService.updatePhoto).toHaveBeenCalled();
    expect(component.uploading).toBe(false);
  });

  it('should reject non-image files', async () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    const event = {
      target: {
        files: [mockFile],
        value: ''
      }
    } as any;
    
    await component.onFileSelected(event);
    
    expect(component.uploadError).toBe('Please choose an image file (jpg or png).');
    expect(mockImageCompressionService.compressImage).not.toHaveBeenCalled();
  });

  it('should handle toggle notifications', async () => {
    mockNotificationService.requestPermission.and.returnValue(Promise.resolve(true));
    mockNotificationService.showNotification.and.returnValue(Promise.resolve());
    
    await component.toggleNotifications();
    
    expect(mockNotificationService.requestPermission).toHaveBeenCalled();
  });

  it('should terminate worker on destroy', () => {
    component.ngOnDestroy();
    expect(mockImageCompressionService.terminate).toHaveBeenCalled();
  });

  it('should handle file upload error', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    mockImageCompressionService.compressImage.and.returnValue(Promise.reject(new Error('Compression failed')));
    
    const event = {
      target: {
        files: [mockFile],
        value: ''
      }
    } as any;
    
    try {
      await component.onFileSelected(event);
    } catch (error) {
      // Expected error
    }
    
    expect(component.uploadError).toBeTruthy();
    expect(component.uploading).toBe(false);
  });

  it('should handle missing user on file upload', async () => {
    Object.defineProperty(mockAuthService, 'currentUser', {
      writable: true,
      value: null
    });
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    const event = {
      target: {
        files: [mockFile],
        value: ''
      }
    } as any;
    
    await component.onFileSelected(event);
    
    expect(component.uploadError).toBe('You must be logged in to upload a photo.');
  });

  it('should handle no file selected', async () => {
    const event = {
      target: {
        files: null,
        value: ''
      }
    } as any;
    
    await component.onFileSelected(event);
    
    expect(mockImageCompressionService.compressImage).not.toHaveBeenCalled();
  });

  it('should handle toggle notifications when permission granted', async () => {
    Object.defineProperty(mockNotificationService, 'isPermissionGranted', {
      writable: true,
      value: true,
      configurable: true
    });
    mockNotificationService.showNotification = jasmine.createSpy('showNotification').and.returnValue(Promise.resolve());
    
    await component.toggleNotifications();
    
    expect(mockNotificationService.showNotification).toHaveBeenCalled();
  });
});
