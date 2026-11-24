import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServerStatus } from './core/services/server-status';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  serverStatus = inject(ServerStatus);

  ngOnInit() {
    this.serverStatus.verificarServidor();
  }
}
