// dash.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { Libros } from '../../../core/services/libros';

@Component({
  selector: 'app-dash',
  imports: [],
  templateUrl: './dash.html',
  styleUrl: './dash.css'
})
export class Dash implements OnInit {
  private librosService = inject(Libros);

  stats = signal({ lectores: 0, libros: 0, promedioRating: 0 });

  ngOnInit() {
    this.librosService.getDashboardStats().subscribe({
      next: (data) => this.stats.set(data)
    });
  }
}
