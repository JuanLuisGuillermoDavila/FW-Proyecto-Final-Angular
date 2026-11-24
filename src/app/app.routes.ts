// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/lector/login/login';
import { Registro } from './features/lector/registro/registro';
import { Layout } from './features/lector/layout/layout';
import { Galeria } from './features/lector/galeria/galeria';
import { DetalleLibro } from './features/lector/detalle-libro/detalle-libro';
import { Afinidad } from './features/lector/afinidad/afinidad';
import { LayoutAdmin } from './features/admin/layout-admin/layout-admin';
import { Dash } from './features/admin/dash/dash';
import { LibrosLista } from './features/admin/libros-lista/libros-lista';
import { LibrosForm } from './features/admin/libros-form/libros-form';
import { LibrosEliminar } from './features/admin/libros-eliminar/libros-eliminar';

export const routes: Routes = [
  { path: '', redirectTo: 'burritolector/login', pathMatch: 'full' },
  { path: 'burritolector/login', component: Login },
  { path: 'burritolector/registro', component: Registro },
  { path: 'burritoadministrador/login', redirectTo: 'burritolector/login', pathMatch: 'full' },

  {
    path: 'burritolector',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'galeria', pathMatch: 'full' },
      { path: 'galeria', component: Galeria },
      { path: 'galeria/:id', component: DetalleLibro },
      { path: 'afinidad', component: Afinidad }
    ]
  },

  {
    path: 'burritoadministrador',
    component: LayoutAdmin,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dash', pathMatch: 'full' },
      { path: 'dash', component: Dash },
      { path: 'libros', component: LibrosLista },
      { path: 'libros/agregar', component: LibrosForm },
      { path: 'libros/editar/:id', component: LibrosForm },
      { path: 'libros/eliminar/:id', component: LibrosEliminar }
    ]
  },

  { path: '**', redirectTo: 'burritolector/login' }
];
