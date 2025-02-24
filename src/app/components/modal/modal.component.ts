import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() productTitle: string = ''; // Recibe el nombre del producto
  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Output() closeModal = new EventEmitter<void>(); // Emite evento para cerrar

  close() {
    this.closeModal.emit(); // Emite evento para cerrar el modal
  }
}
