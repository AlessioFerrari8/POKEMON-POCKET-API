import { Component, Input, Output, EventEmitter, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPokemon } from '../interfaces/i-pokemon';
import { PokemonCollectionService } from '../../services/pokemon-collection-firestore.service';

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

  private pokemonCollectionService = inject(PokemonCollectionService);
  loadingCardId: WritableSignal<string | null> = signal(null);
  userCardIds: WritableSignal<Set<string>> = signal(new Set());

  ngOnInit() {
    // Carica le carte dell'utente
    this.pokemonCollectionService.getUserCards().subscribe(userCards => {
      const ids = new Set(userCards.map(c => c.id));
      this.userCardIds.set(ids);
    });
  }

  onCardClick(card: IPokemon): void {
    this.cardClicked.emit(card);
  }

  onGotIt(card: IPokemon, event: Event): void {
    event.stopPropagation();
    this.loadingCardId.set(card.id);
    
    this.pokemonCollectionService.addCard(card).subscribe({
      next: () => {
        this.userCardIds.update(ids => {
          ids.add(card.id);
          return ids;
        });
        this.loadingCardId.set(null);
      },
      error: (err) => {
        console.error('Error adding card:', err);
        this.loadingCardId.set(null);
      }
    });
  }

  onMissing(card: IPokemon, event: Event): void {
    event.stopPropagation();
    this.loadingCardId.set(card.id);
    
    // Qui potremmo aggiungere una logica diversa per le carte mancanti
    // Per ora removed dalla collezione se presente
    this.pokemonCollectionService.getUserCards().subscribe(userCards => {
      const userCard = userCards.find(c => c.id === card.id);
      if (userCard) {
        this.pokemonCollectionService.deleteCard(userCard.id).subscribe({
          next: () => {
            this.userCardIds.update(ids => {
              ids.delete(card.id);
              return ids;
            });
            this.loadingCardId.set(null);
          },
          error: (err) => {
            console.error('Error removing card:', err);
            this.loadingCardId.set(null);
          }
        });
      } else {
        this.loadingCardId.set(null);
      }
    });
  }

  isCardOwned(cardId: string): boolean {
    return this.userCardIds().has(cardId);
  }
}