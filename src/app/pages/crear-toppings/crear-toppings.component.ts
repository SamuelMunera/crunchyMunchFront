import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { inject } from '@angular/core';
import { ToppingsService } from '../../services/toppings.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-toppings',
  standalone: true,
  imports: [RouterLinkWithHref, ReactiveFormsModule, CommonModule],
  templateUrl: './crear-toppings.component.html',
  styleUrl: './crear-toppings.component.css',
})
export class CrearToppingsComponent {
  toppingForm: FormGroup;
  mensajeExito: string = '';
  mostrarMensaje: boolean = false;
  private toppingsService: ToppingsService = inject(ToppingsService);

  constructor(private fb: FormBuilder) {
    this.toppingForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.toppingForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(values => {
        console.log('Valores actuales del formulario:', values);
      });
  }

  enviarFormulario(): void {
    if (this.toppingForm.valid) {
      console.log('Enviando formulario...', this.toppingForm.value);
      
      this.toppingsService.createToppings(this.toppingForm.value).subscribe({
        next: () => {
          console.log('Topping creado con éxito');
          // Mostrar mensaje de éxito
          this.mensajeExito = `¡El topping "${this.toppingForm.value.name}" ha sido creado con éxito!`;
          this.mostrarMensaje = true;
          
          // Resetear el formulario
          this.toppingForm.reset();
          
          // Ocultar el mensaje después de 3 segundos
          setTimeout(() => {
            this.mostrarMensaje = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Error en la solicitud:', error);
          this.mensajeExito = 'Hubo un error al crear el topping. Por favor, inténtalo de nuevo.';
          this.mostrarMensaje = true;
          
          // Ocultar el mensaje de error después de 3 segundos
          setTimeout(() => {
            this.mostrarMensaje = false;
          }, 3000);
        }
      });
    } else {
      console.log('Formulario inválido');
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.toppingForm.controls).forEach(key => {
        this.toppingForm.get(key)?.markAsTouched();
      });
    }
  }
}