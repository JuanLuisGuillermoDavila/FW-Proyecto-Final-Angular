// libros-lista.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Libros } from '../../../core/services/libros';
import { Libro } from '../../../core/models/models';

@Component({
  selector: 'app-libros-lista',
  imports: [RouterLink],
  templateUrl: './libros-lista.html',
  styleUrl: './libros-lista.css'
})
export class LibrosLista implements OnInit {
  private librosService = inject(Libros);
  libros = signal<Libro[]>([]);

  ngOnInit() {
    this.librosService.getLibros().subscribe({
      next: (data) => this.libros.set(data)
    });
  }
}
