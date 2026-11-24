import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Libros } from '../../../core/services/libros';

@Component({
  selector: 'app-libros-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './libros-form.html',
  styleUrl: './libros-form.css'
})
export class LibrosForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private librosService = inject(Libros);

  libroId = signal<number | null>(null);
  archivoSeleccionado: File | null = null;
  nombreArchivo = signal<string>('');
  vistaPrevia = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    editorial: ['', Validators.required],
    autor: ['', Validators.required],
    genero: ['', Validators.required],
    sinopsis: ['', Validators.required]
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.libroId.set(id);
      this.librosService.getLibroById(id).subscribe(libro => {
        this.form.patchValue({
          titulo: libro.titulo,
          editorial: libro.editorial,
          autor: libro.autor,
          genero: libro.genero,
          sinopsis: libro.sinopsis
        });
        if (libro.imagen) {
          this.vistaPrevia.set(libro.imagen);
        }
      });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
      this.nombreArchivo.set(this.archivoSeleccionado.name);

      const reader = new FileReader();
      reader.onload = () => this.vistaPrevia.set(reader.result as string);
      reader.readAsDataURL(this.archivoSeleccionado);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.getRawValue(),
      imagen: this.vistaPrevia() || ''
    };

    const id = this.libroId();
    const request$ = id
      ? this.librosService.actualizarLibro(id, payload)
      : this.librosService.crearLibro(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/burritoadministrador/libros'])
    });
  }
}
