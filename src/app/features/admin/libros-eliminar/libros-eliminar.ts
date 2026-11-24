// libros-eliminar.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Libros } from '../../../core/services/libros';
import { Libro } from '../../../core/models/models';

@Component({
  selector: 'app-libros-eliminar',
  imports: [RouterLink],
  templateUrl: './libros-eliminar.html',
  styleUrl: './libros-eliminar.css'
})
export class LibrosEliminar implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private librosService = inject(Libros);

  libro = signal<Libro | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.librosService.getLibroById(id).subscribe(data => this.libro.set(data));
  }

  confirmarEliminacion() {
    const id = this.libro()?.id;
    if (!id) return;
    this.librosService.eliminarLibro(id).subscribe({
      next: () => this.router.navigate(['/burritoadministrador/libros'])
    });
  }
}
