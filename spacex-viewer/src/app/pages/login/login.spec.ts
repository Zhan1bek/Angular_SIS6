import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {},
      paramMap: of({}),
      queryParamMap: of({})
    };

    // Mock navigator for forms
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0'
    });

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form with email and password', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('password')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should require email and password', () => {
    expect(component.form.get('email')?.hasError('required')).toBe(true);
    expect(component.form.get('password')?.hasError('required')).toBe(true);
  });

  it('should call login on submit with valid form', async () => {
    mockAuthService.login.and.returnValue(Promise.resolve());
    
    component.form.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });
    
    await component.onSubmit();
    
    expect(mockAuthService.login).toHaveBeenCalledWith('test@test.com', 'password123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should not call login with invalid form', async () => {
    component.form.patchValue({
      email: '',
      password: ''
    });
    
    await component.onSubmit();
    
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should handle login error', async () => {
    mockAuthService.login.and.returnValue(Promise.reject({ message: 'Login failed' }));
    
    component.form.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });
    
    await component.onSubmit();
    
    expect(component.error).toBe('Login failed');
    expect(component.loading).toBe(false);
  });
});
