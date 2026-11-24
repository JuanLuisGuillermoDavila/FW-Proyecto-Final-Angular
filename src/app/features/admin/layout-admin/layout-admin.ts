// layout-admin.ts
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-layout-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout-admin.html',
  styleUrl: './layout-admin.css'
})
export class LayoutAdmin {
  auth = inject(Auth);
}
