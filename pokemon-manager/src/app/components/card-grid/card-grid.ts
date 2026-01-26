import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPokemon } from '../interfaces/i-pokemon';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-grid.html',
  styleUrl: './card-grid.css',
})
export class CardGridComponent {
  @Input() cards: IPokemon[] = [];
}