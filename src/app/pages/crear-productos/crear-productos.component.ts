// crear-productos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Category {
  _id: string;
  name: string;
}

interface Topping {
  _id: string;
  name: string;
}

interface IceCream {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-crear-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-productos.component.html',
  styleUrl: './crear-productos.component.css'
})
export class CrearProductosComponent implements OnInit {
  productoForm: FormGroup;
  mostrarMensaje: boolean = false;
  mensajeExito: string = '';
  
  // Arreglos para almacenar las opciones de los desplegables
  categories: Category[] = [];
  toppings: Topping[] = [];
  iceCreams: IceCream[] = [];
  
  // Variable para almacenar la imagen seleccionada
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      informacion: ['', Validators.required],
      categoria: ['', Validators.required],
      toppings: this.fb.array([]),
      helados: this.fb.array([]),
      recomendaciones: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    // Cargar categorías, toppings y helados al iniciar el componente
    this.loadCategories();
    this.loadToppings();
    this.loadIceCreams();
  }

  loadCategories(): void {
    this.http.get<Category[]>('http://api.crunchy-munch.com/api/category/getAll').subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }

  loadToppings(): void {
    this.http.get<Topping[]>('http://api.crunchy-munch.com/api/topping/getAll').subscribe(
      (data) => {
        this.toppings = data;
      },
      (error) => {
        console.error('Error al cargar toppings:', error);
      }
    );
  }

  loadIceCreams(): void {
    this.http.get<IceCream[]>('http://api.crunchy-munch.com/api/iceCream/getAll').subscribe(
      (data) => {
        this.iceCreams = data;
      },
      (error) => {
        console.error('Error al cargar helados:', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Método para alternar la selección de toppings con un solo clic
  toggleToppingSelection(toppingId: string): void {
    const toppingsArray = this.productoForm.get('toppings') as FormArray;
    const index = toppingsArray.value.findIndex((id: string) => id === toppingId);
    
    if (index === -1) {
      // Si no está seleccionado, lo agregamos
      toppingsArray.push(this.fb.control(toppingId));
    } else {
      // Si ya está seleccionado, lo eliminamos
      toppingsArray.removeAt(index);
    }
  }

  // Método para alternar la selección de helados con un solo clic
  toggleIceCreamSelection(iceCreamId: string): void {
    const heladosArray = this.productoForm.get('helados') as FormArray;
    const index = heladosArray.value.findIndex((id: string) => id === iceCreamId);
    
    if (index === -1) {
      // Si no está seleccionado, lo agregamos
      heladosArray.push(this.fb.control(iceCreamId));
    } else {
      // Si ya está seleccionado, lo eliminamos
      heladosArray.removeAt(index);
    }
  }

  // Método para verificar si un topping está seleccionado
  isToppingSelected(toppingId: string): boolean {
    const toppingsArray = this.productoForm.get('toppings') as FormArray;
    return toppingsArray.value.includes(toppingId);
  }

  // Método para verificar si un helado está seleccionado
  isIceCreamSelected(iceCreamId: string): boolean {
    const heladosArray = this.productoForm.get('helados') as FormArray;
    return heladosArray.value.includes(iceCreamId);
  }

  crearProducto(): void {
    if (this.productoForm.valid && this.selectedFile) {
      const formData = new FormData();
      
      // Agregamos los campos del formulario al formData
      formData.append('name', this.productoForm.value.nombre);
      formData.append('description', this.productoForm.value.informacion);
      formData.append('category', this.productoForm.value.categoria);
      formData.append('recommendation', this.productoForm.value.recomendaciones);
      formData.append('price', this.productoForm.value.precio.toString());
      formData.append('photo', this.selectedFile);
      
      // Crear el producto
      this.http.post('http://api.crunchy-munch.com/api/product/create', formData).subscribe(
        (response: any) => {
          // Si el producto se creó exitosamente, asignamos los toppings
          const toppingsArray = this.productoForm.get('toppings') as FormArray;
          if (toppingsArray.length > 0) {
            this.assignToppings(response._id, toppingsArray.value);
          }
          
          // Y también los helados
          const heladosArray = this.productoForm.get('helados') as FormArray;
          if (heladosArray.length > 0) {
            this.assignIceCreams(response._id, heladosArray.value);
          }
          
          this.mensajeExito = '¡Producto creado exitosamente!';
          this.mostrarMensaje = true;
          this.productoForm.reset();
          this.selectedFile = null;
          
          // Ocultar el mensaje después de 3 segundos
          setTimeout(() => {
            this.mostrarMensaje = false;
          }, 3000);
        },
        (error) => {
          console.error('Error al crear producto:', error);
          this.mensajeExito = 'Error al crear el producto';
          this.mostrarMensaje = true;
          
          setTimeout(() => {
            this.mostrarMensaje = false;
          }, 3000);
        }
      );
    } else {
      // Marcar todos los campos como touched para mostrar validaciones
      Object.keys(this.productoForm.controls).forEach(key => {
        this.productoForm.get(key)?.markAsTouched();
      });
      
      this.mensajeExito = 'Por favor, completa todos los campos requeridos';
      this.mostrarMensaje = true;
      
      setTimeout(() => {
        this.mostrarMensaje = false;
      }, 3000);
    }
  }

  assignToppings(productId: string, toppingIds: string[]): void {
    this.http.patch(`http://api.crunchy-munch.com/api/product/${productId}/toppings`, {
      toppings: toppingIds
    }).subscribe(
      () => console.log('Toppings asignados correctamente'),
      (error) => console.error('Error al asignar toppings:', error)
    );
  }

  assignIceCreams(productId: string, iceCreamIds: string[]): void {
    this.http.patch(`http://api.crunchy-munch.com/api/product/${productId}/iceCream`, {
      iceCream: iceCreamIds
    }).subscribe(
      () => console.log('Helados asignados correctamente'),
      (error) => console.error('Error al asignar helados:', error)
    );
  }
}