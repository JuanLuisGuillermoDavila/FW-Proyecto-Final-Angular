export interface Usuario {
  id?: number;
  fullname: string;
  email: string;
  role?: 'CONSULTA' | 'ADMIN';
}

export interface LoginResponse {
  estado?: number;
  mensaje?: string;
  token: string;
  usuario: Usuario;
}

export interface Libro {
  id?: number;
  titulo: string;
  autor: string;
  editorial: string;
  genero: string;
  sinopsis: string;
  imagen?: string;
  miPuntuacion?: number;
  promedioRating?: number;
}

export interface AfinidadItem {
  libroId?: number;
  titulo: string;
  lectorId?: number;
  lector: string;
  suRating: number;
  miRating: number;
}
