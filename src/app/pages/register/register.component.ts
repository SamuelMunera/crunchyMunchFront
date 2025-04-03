// register.component.ts
import { Component } from '@angular/core';
import { RouterLinkWithHref, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLinkWithHref, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('', {validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {validators: [Validators.required, Validators.minLength(6)]}),
    name: new FormControl('', {validators: [Validators.required]}),
    lastName: new FormControl('', {validators: [Validators.required]}),
    phone: new FormControl('', {validators: [Validators.required, Validators.pattern('[0-9]{10}')]})
  });

  

  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get name() { return this.registerForm.get('name')!; }
  get lastName() { return this.registerForm.get('lastName')!; }
  get phone() { return this.registerForm.get('phone')!; }

  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
  ) {}

  // Tus getters como están actualmente

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.userService.createUsers(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          // Redirigir al usuario a la página de inicio de sesión o dashboard
          this.router.navigate(['/Login']);
        },
        error: (error) => {
          console.error('Error en el registro', error);
          this.errorMessage = error.error?.message || 'Error al registrar. Intente nuevamente.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      // Marcar campos como touched para mostrar errores
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)!.markAsTouched();
      });
    }
  }
}