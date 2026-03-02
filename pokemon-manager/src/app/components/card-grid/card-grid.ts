import { Component, Input, Output, EventEmitter, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPokemon } from '../interfaces/i-pokemon';
import { UsersService } from '../../services/users-service';

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

  private usersService = inject(UsersService);
  loadingCardId: WritableSignal<string | null> = signal(null);

  onCardClick(card: IPokemon): void {
    this.cardClicked.emit(card);
  }

  async onGotIt(card: IPokemon, event: Event): Promise<void> {
    event.stopPropagation();
    this.loadingCardId.set(card.id);
    try {
      await this.usersService.toggleCardOwned(card.id);
    } finally {
      this.loadingCardId.set(null);
    }
  }

  async onMissing(card: IPokemon, event: Event): Promise<void> {
    event.stopPropagation();
    this.loadingCardId.set(card.id);
    try {
      await this.usersService.toggleMissingCard(card);
    } finally {
      this.loadingCardId.set(null);
    }
  }

  isCardOwned(cardId: string): boolean {
    return this.usersService.isCardOwned(cardId);
  }

  isCardMissing(cardId: string): boolean {
    return this.usersService.isCardMissing(cardId);
  }
}