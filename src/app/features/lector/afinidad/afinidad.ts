import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Libros } from '../../../core/services/libros';
import { Auth } from '../../../core/services/auth';
import { AfinidadItem } from '../../../core/models/models';

type ColumnaOrden = 'titulo' | 'lector' | 'suRating' | 'miRating';

@Component({
  selector: 'app-afinidad',
  imports: [],
  templateUrl: './afinidad.html',
  styleUrl: './afinidad.css'
})
export class Afinidad implements OnInit {
  private librosService = inject(Libros);
  private auth = inject(Auth);

  afinidadesRaw = signal<AfinidadItem[]>([]);
  estrellas = [1, 2, 3, 4, 5];

  busqueda = signal('');
  columnaOrden = signal<ColumnaOrden>('titulo');
  direccionAsc = signal(true);

  usuariosMuyAfines = computed(() => {
    const lista = this.afinidadesRaw();
    if (!Array.isArray(lista)) return [];

    const termino = this.busqueda().trim().toLowerCase();

    const filtrados = termino
      ? lista.filter(
          a =>
            (a.titulo ?? '').toLowerCase().includes(termino) ||
            (a.lector ?? '').toLowerCase().includes(termino) ||
            String(a.suRating ?? '').includes(termino) ||
            String(a.miRating ?? '').includes(termino)
        )
      : lista;

    const col = this.columnaOrden();
    const asc = this.direccionAsc() ? 1 : -1;

    return [...filtrados].sort((a, b) => {
      if (col === 'suRating' || col === 'miRating') {
        return ((a[col] ?? 0) - (b[col] ?? 0)) * asc;
      }
      return String(a[col] ?? '').localeCompare(String(b[col] ?? ''), 'es', { sensitivity: 'base' }) * asc;
    });
  });

  ngOnInit() {
    const userId = this.auth.currentUser()?.id;
    if (userId) {
      this.librosService.getAfinidades(userId).subscribe({
        next: (data) => this.afinidadesRaw.set(data),
        error: (err) => console.error('Error en afinidad:', err)
      });
    }
  }

  ordenarPor(columna: ColumnaOrden) {
    if (this.columnaOrden() === columna) {
      this.direccionAsc.set(!this.direccionAsc());
    } else {
      this.columnaOrden.set(columna);
      this.direccionAsc.set(true);
    }
  }
}
