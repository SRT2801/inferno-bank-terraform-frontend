import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalsy();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTruthy();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalsy();
  });

  it('should show error when submitting empty form', () => {
    component.onSubmit();
    expect(component.error).toBe('Por favor completa todos los campos');
  });

  it('should show error for invalid email', () => {
    component.email = 'invalid-email';
    component.password = 'password123';
    component.onSubmit();
    expect(component.error).toBe('Por favor ingresa un email válido');
  });

  it('should validate correct email format', () => {
    component.email = 'test@example.com';
    component.password = 'password123';
    component.onSubmit();
    expect(component.loading).toBeTruthy();
  });
});
