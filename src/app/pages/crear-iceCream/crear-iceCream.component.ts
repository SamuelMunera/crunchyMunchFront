import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { inject } from '@angular/core';
import { IceCreamService } from '../../services/iceCreams.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-toppings',
  standalone: true,
  imports: [RouterLinkWithHref, ReactiveFormsModule, CommonModule],
  templateUrl: './crear-iceCream.component.html',
  styleUrl: './crear-iceCream.component.css',
})
export class CrearIceCreamComponent {
  iceCreamForm: FormGroup;
  mensajeExito: string = '';
  mostrarMensaje: boolean = false;
  private iceCreamService: IceCreamService = inject(IceCreamService);

  constructor(private fb: FormBuilder) {
    this.iceCreamForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.iceCreamForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(values => {
        console.log('Valores actuales del formulario:', values);
      });
  }

  enviarFormulario(): void {
    if (this.iceCreamForm.valid) {
      console.log('Enviando formulario...', this.iceCreamForm.value);
      
      this.iceCreamService.createIceCreams(this.iceCreamForm.value).subscribe({
        next: () => {
          console.log('Topping creado con éxito');
          // Mostrar mensaje de éxito
          this.mensajeExito = `¡El topping "${this.iceCreamForm.value.name}" ha sido creado con éxito!`;
          this.mostrarMensaje = true;
          
          // Resetear el formulario
          this.iceCreamForm.reset();
          
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
      Object.keys(this.iceCreamForm.controls).forEach(key => {
        this.iceCreamForm.get(key)?.markAsTouched();
      });
    }
  }
}