import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SignupComponent } from './signup';
import { AuthService } from '../../services/auth';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['signup']);
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
      imports: [SignupComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form with email, password, and repeatPassword', () => {
    expect(component.form).toBeDefined();
    expect(component.emailControl).toBeTruthy();
    expect(component.passwordControl).toBeTruthy();
    expect(component.repeatPasswordControl).toBeTruthy();
  });

  it('should validate email format', () => {
    component.emailControl?.setValue('invalid-email');
    expect(component.emailControl?.hasError('email')).toBe(true);
    
    component.emailControl?.setValue('valid@email.com');
    expect(component.emailControl?.hasError('email')).toBe(false);
  });

  it('should validate password complexity', () => {
    component.passwordControl?.setValue('short');
    expect(component.passwordControl?.hasError('passwordComplexity')).toBe(true);
    
    component.passwordControl?.setValue('longpassword123!');
    expect(component.passwordControl?.hasError('passwordComplexity')).toBe(false);
  });

  it('should validate password match', () => {
    component.form.patchValue({
      password: 'password123!',
      repeatPassword: 'different123!'
    });
    expect(component.form.hasError('passwordMismatch')).toBe(true);
    
    component.form.patchValue({
      password: 'password123!',
      repeatPassword: 'password123!'
    });
    expect(component.form.hasError('passwordMismatch')).toBe(false);
  });

  it('should call signup on submit with valid form', async () => {
    mockAuthService.signup.and.returnValue(Promise.resolve());
    
    component.form.patchValue({
      email: 'test@test.com',
      password: 'password123!',
      repeatPassword: 'password123!'
    });
    
    await component.onSubmit();
    
    expect(mockAuthService.signup).toHaveBeenCalledWith('test@test.com', 'password123!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should not call signup with invalid form', async () => {
    component.form.patchValue({
      email: '',
      password: '',
      repeatPassword: ''
    });
    
    await component.onSubmit();
    
    expect(mockAuthService.signup).not.toHaveBeenCalled();
  });

  it('should handle signup error', async () => {
    mockAuthService.signup.and.returnValue(Promise.reject({ message: 'Signup failed' }));
    
    component.form.patchValue({
      email: 'test@test.com',
      password: 'password123!',
      repeatPassword: 'password123!'
    });
    
    await component.onSubmit();
    
    expect(component.error).toBe('Signup failed');
    expect(component.loading).toBe(false);
  });
});
