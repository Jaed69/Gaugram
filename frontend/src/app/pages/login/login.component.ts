import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login({ login: email, password }).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Error al iniciar sesión';
        }
      });
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
