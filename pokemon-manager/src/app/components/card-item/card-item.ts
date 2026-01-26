import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPokemon } from '../interfaces/i-pokemon';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-item.html',
  styleUrl: './card-item.css',
})
export class CardItemComponent {
  @Input() card!: IPokemon;
}
