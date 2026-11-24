import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Libros } from '../../../core/services/libros';
import { Auth } from '../../../core/services/auth';
import { Libro } from '../../../core/models/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle-libro',
  imports: [RouterLink],
  templateUrl: './detalle-libro.html',
  styleUrl: './detalle-libro.css'
})
export class DetalleLibro implements OnInit {
  private route = inject(ActivatedRoute);
  private librosService = inject(Libros);
  private auth = inject(Auth);

  libro = signal<Libro | null>(null);
  puntuacion = signal<number>(0);
  estrellas = [1, 2, 3, 4, 5];

  ngOnInit() {
    const libroId = Number(this.route.snapshot.paramMap.get('id'));
    const userId = this.auth.currentUser()?.id;

    this.librosService.getLibroById(libroId).subscribe(data => {
      this.libro.set(data);
    });

    if (userId) {
      this.librosService.getMiPuntuacion(userId, libroId).subscribe({
        next: (res) => this.puntuacion.set(res?.rating || 0),
        error: () => this.puntuacion.set(0)
      });
    }
  }

  calificar(valor: number) {
    const libroId = this.libro()?.id;
    const userId = this.auth.currentUser()?.id;
    if (!libroId || !userId) return;

    // Si ya tenía ese valor, dejamos como mínimo 1 estrella (o si quieres limpiar solo en UI sin llamar al API)
    if (this.puntuacion() === valor) {
      this.puntuacion.set(1);
      this.librosService.calificarLibro(userId, libroId, 1).subscribe();
      return;
    }

    this.puntuacion.set(valor);
    this.librosService.calificarLibro(userId, libroId, valor).subscribe();
  }
}
