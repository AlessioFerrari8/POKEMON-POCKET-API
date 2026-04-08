import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { PokemonSDK } from '../../core/services/pokemon-sdk';
import { IPokemon } from '../../shared/components/interfaces/i-pokemon';
import { ActivatedRoute, Router } from '@angular/router';
import { CardGridComponent } from '../../shared/components/card-grid/card-grid';
import { CardItemComponent } from '../../shared/components/card-item/card-item';
import { EXPANSIONS, ROUTES } from '../../core/constants';


@Component({
  selector: 'app-expansion-detail',
  standalone: true,
  imports: [CommonModule, CardGridComponent, CardItemComponent],
  templateUrl: './expansion-detail.html',
  styleUrl: './expansion-detail.css',
})
export class ExpansionDetail {
  private service = inject(PokemonSDK);
  private router = inject(Router);

  expansionSets = EXPANSIONS;

  selectedExpansion: WritableSignal<string | null> = signal(null);
  cards: WritableSignal<IPokemon[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  selectedCard: WritableSignal<IPokemon | null> = signal(null);
  isLoadingDetails: WritableSignal<boolean> = signal(false);

  ExpansionClick(expansionId: string): void {
    this.selectedExpansion.set(expansionId);
    this.loadCards(expansionId);
    // mostro ogni volta l'id 
    this.router.navigate([ROUTES.EXPANSION_DETAIL, expansionId]);
  }

  private loadCards(expansionId: string): void {
    this.isLoading.set(true);
    this.service.getSet(expansionId).subscribe({
      next: (data) => {
        if (data && data.cards) {
          this.cards.set(data.cards);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading cards:', error);
        this.isLoading.set(false);
      }
    });
  }

  onCardClicked(card: IPokemon): void {
    this.selectedCard.set(card);
    this.isLoadingDetails.set(true);
    
    this.service.getPokemonDetails(card.id, card.image).subscribe({
      next: (details) => {
        if (details && Object.keys(details).length > 0) {
          this.selectedCard.set(details);
        }
        this.isLoadingDetails.set(false);
      },
      error: (err) => {
        console.error('Error loading card details:', err);
        this.isLoadingDetails.set(false);
      }
    });
  }

  closeCardDetail(): void {
    this.selectedCard.set(null);
  }
}

