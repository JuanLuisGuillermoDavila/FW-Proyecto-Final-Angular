import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type EstadoServidor = 'oculto' | 'despertando' | 'activo';

@Injectable({ providedIn: 'root' })
export class ServerStatus {
  private http = inject(HttpClient);
  // Usamos el endpoint de libros en Render para comprobar si responde[cite: 13]
  private pingUrl = 'https://proyecto-final-el-burrito-lector.onrender.com/api/v1/libros';

  estado = signal<EstadoServidor>('oculto');

  verificarServidor() {
    // Si tarda más de 2.5 segundos en responder, asumimos que Render estaba dormido
    const timerDormido = setTimeout(() => {
      this.estado.set('despertando');
    }, 2500);

    this.http.get(this.pingUrl).subscribe({
      next: () => this.marcarComoActivo(timerDormido),
      error: (err) => {
        // Si responde con cualquier código HTTP (ej. 401/403), el servidor ya está despierto
        if (err.status && err.status > 0) {
          this.marcarComoActivo(timerDormido);
        } else {
          // Si hubo corte de red por timeout inicial, reintentamos en 3 segundos
          clearTimeout(timerDormido);
          this.estado.set('despertando');
          setTimeout(() => this.verificarServidor(), 3000);
        }
      }
    });
  }

  private marcarComoActivo(timer: ReturnType<typeof setTimeout>) {
    clearTimeout(timer);
    const estabaDormido = this.estado() === 'despertando';

    // Mostramos la alerta verde de "Activo" (especialmente útil si avisamos que estaba dormido)
    if (estabaDormido) {
      this.estado.set('activo');
      setTimeout(() => {
        this.estado.set('oculto');
      }, 4500); // Se oculta automáticamente después de 4.5 segundos
    } else {
      this.estado.set('oculto');
    }
  }
}
