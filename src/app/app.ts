import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { Home } from './components/home/home';
import { Counter } from '@components/counter/counter';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, Counter, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('propery-app');

  private router = inject(Router);
  ngOnInit() {
    console.log('App component was instantiated');
    this.title.set('propery app reloaded');
  }

  is404Page(): boolean {
    return this.router.url.startsWith('/404');
  }
}
