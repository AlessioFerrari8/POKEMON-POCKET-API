import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Root } from '../interfaces/i-pokemon';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-grid.html',
  styleUrl: './card-grid.css',
})
export class CardGridComponent {
  @Input() cards: Root[] = [];
}