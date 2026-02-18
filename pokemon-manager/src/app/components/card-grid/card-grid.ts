import { Component, Input, Output, EventEmitter, signal, WritableSignal } from '@angular/core';
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
  @Output() cardClicked = new EventEmitter<IPokemon>();

  loadingCardId: WritableSignal<string | null> = signal(null);
  userCardIds: WritableSignal<Set<string>> = signal(new Set());

  onCardClick(card: IPokemon): void {
    this.cardClicked.emit(card);
  }

  onGotIt(card: IPokemon, event: Event): void {
    event.stopPropagation();
    this.loadingCardId.set(card.id);
    // TODO: Implementare logica per aggiungere carta
    this.loadingCardId.set(null);
  }

  onMissing(card: IPokemon, event: Event): void {
    event.stopPropagation();
    this.loadingCardId.set(card.id);
    // TODO: Implementare logica per marcare come mancante
    this.loadingCardId.set(null);
  }

  isCardOwned(cardId: string): boolean {
    return this.userCardIds().has(cardId);
  }
}