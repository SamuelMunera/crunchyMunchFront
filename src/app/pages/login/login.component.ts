import { Component } from '@angular/core';
import { RouterLinkWithHref, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormsModule, Validators, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLinkWithHref, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', {validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {validators: [Validators.required]})
  });

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get email() { return this.loginForm.get('email') as FormControl; }
  get password() { return this.loginForm.get('password') as FormControl; }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.email.value;
    const password = this.password.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        this.isLoading = false;
        // Redirigir al usuario a la página principal o dashboard
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error en el login', error);
        this.isLoading = false;
        // Mostrar mensaje de error al usuario
        if (error.status === 401) {
          this.errorMessage = 'Credenciales incorrectas';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
        }
      }
    });
  }
}