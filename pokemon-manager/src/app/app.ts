import { Component, signal } from '@angular/core';
import { NavBar } from './components/nav-bar/nav-bar';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavBar, RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  title = 'pokemon-manager';

  constructor(public router: Router) {}

  isHome(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }
}
