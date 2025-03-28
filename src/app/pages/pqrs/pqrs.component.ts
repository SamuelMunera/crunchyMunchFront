import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PqrsService } from '../../services/pqrs.service'; // Importa el servicio correctamente
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pqrs',
  standalone: true,
  templateUrl: './pqrs.component.html',
  styleUrls: ['./pqrs.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PqrsComponent implements OnInit {
  pqrsForm: FormGroup;
  private pqrsService: PqrsService = inject(PqrsService); // Inyecta el servicio

  constructor(private fb: FormBuilder) {
    this.pqrsForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.pqrsForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(values => {
        console.log('Valores actuales del formulario:', values);
      });
  }

  enviarFormulario(): void {
    if (this.pqrsForm.valid) {
      console.log('Enviando formulario...', this.pqrsForm.value);
  
      this.pqrsService.createPqrs(this.pqrsForm.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'PQRS Enviado 🎉',
            text: 'Tu solicitud ha sido enviada con éxito.',
            confirmButtonColor: '#3085d6'
          });
          this.pqrsForm.reset();
        },
        error: (error) => { // Asegura que capturamos el error
          console.error('Error en la solicitud:', error);
          
          Swal.fire({
            icon: 'error',
            title: 'Error al Enviar',
            text: error?.error?.message || 'Hubo un problema al enviar la PQRS.',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      const invalidFields = Object.keys(this.pqrsForm.controls)
        .filter(field => this.pqrsForm.get(field)?.invalid)
        .map(field => `- ${field}`);
  
      Swal.fire({
        icon: 'warning',
        title: 'Campos Inválidos',
        html: `Tienes los siguientes campos incorrectos:<br><b>${invalidFields.join('<br>')}</b>`,
        confirmButtonColor: '#f39c12'
      });
    }
  }
  
}
