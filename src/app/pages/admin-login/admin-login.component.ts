import { Component } from '@angular/core';
import { RouterLinkWithHref, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormsModule, Validators, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthServices } from '../../services/auth-admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [RouterLinkWithHref, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  loginForm = new FormGroup({
    userName: new FormControl('', {validators: [Validators.required]}),
    password: new FormControl('', {validators: [Validators.required]})
  });

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthServices,
    private router: Router
  ) {}

  get userName() { return this.loginForm.get('userName') as FormControl; }
  get password() { return this.loginForm.get('password') as FormControl; }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userName = this.userName.value;
    const password = this.password.value;

    // Usar adminLogin en lugar de login
    this.authService.adminLogin(userName, password).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        this.isLoading = false;
        // Redirigir al usuario a la página principal o dashboard de admin
        this.router.navigate(['/admin/dashboard']);
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