// galeria.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Libros } from '../../../core/services/libros';
import { Libro } from '../../../core/models/models';

@Component({
  selector: 'app-galeria',
  imports: [RouterLink],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css'
})
export class Galeria implements OnInit {
  private librosService = inject(Libros);
  listaLibros = signal<Libro[]>([]);

  ngOnInit() {
    this.librosService.getLibros().subscribe({
      next: (data) => this.listaLibros.set(data)
    });
  }
}
