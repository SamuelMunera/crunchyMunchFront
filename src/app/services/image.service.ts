import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:3000/uploads'; // URL del backend
  
  getImageUrl(relativePath: string): string {
    if (!relativePath) return 'assets/default-image.png'; // imagen por defecto
    
    // Si la ruta ya es completa (comienza con http o https), devuélvela tal cual
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    
    // Asegura que relativePath no comience con / para evitar doble barra
    const path = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
    
    // Concatena correctamente la URL base con la ruta relativa
    return `${this.apiUrl}/${path}`;
  }
}