import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { AfinidadItem, Libro } from '../models/models';

@Injectable({ providedIn: 'root' })
export class Libros {
  private http = inject(HttpClient);
  private apiUrl = 'https://proyecto-final-el-burrito-lector.onrender.com/api/v1';

  // --- LIBROS ---
  getLibros() {
    return this.http.get<any>(`${this.apiUrl}/libros`).pipe(
      map((res) => (res?._embedded?.libroDtoList || []) as Libro[])
    );
  }

  getLibroById(id: number) {
    return this.http.get<Libro>(`${this.apiUrl}/libros/${id}`);
  }

  buscarLibros(titulo: string) {
    return this.http.get<any>(`${this.apiUrl}/libros/buscar`, { params: { titulo } }).pipe(
      map((res) => (res?._embedded?.libroDtoList || []) as Libro[])
    );
  }

  crearLibro(data: FormData | Libro) {
    return this.http.post<Libro>(`${this.apiUrl}/libros`, data);
  }

  actualizarLibro(id: number, data: FormData | Libro) {
    return this.http.put<Libro>(`${this.apiUrl}/libros/${id}`, data);
  }

  eliminarLibro(id: number) {
    return this.http.delete(`${this.apiUrl}/libros/${id}`);
  }

  // --- DASHBOARD ADMIN ---
  getDashboardStats() {
  return this.http.get<any>(`${this.apiUrl}/libros/dash`).pipe(
    map((res) => ({
      lectores: res.totalLectores,
      libros: res.totalLibros,
      promedioRating: res.promedioRating
    }))
  );
}

  // --- VALORACIONES Y AFINIDAD ---
  calificarLibro(userId: number, libroId: number, rating: number) {
    return this.http.post(`${this.apiUrl}/valoraciones`, { userId, libroId, rating });
  }

  getMiPuntuacion(userId: number, libroId: number) {
    return this.http.get<{ rating: number }>(`${this.apiUrl}/valoraciones/usuario/${userId}/libro/${libroId}`);
  }

getAfinidades(userId: number) {
    return this.http.get<any>(`${this.apiUrl}/valoraciones/afinidad/${userId}`).pipe(
      map((res) => (res?._embedded?.afinidadDtoList || []) as AfinidadItem[])
    );
  }
}

