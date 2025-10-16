import { Component, signal } from '@angular/core';
import { Player } from './app/services/player';
import { PlayerListComponent } from './app/components/player/player-list/player-list';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,PlayerListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  //protected readonly title = signal('cricket-app-frontend');
}
