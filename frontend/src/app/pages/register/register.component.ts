import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      
      const { username, email, fullName, password } = this.registerForm.value;
      
      this.authService.register({ username, email, fullName, password }).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Error al crear la cuenta';
        }
      });
    }
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get fullName() { return this.registerForm.get('fullName'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
