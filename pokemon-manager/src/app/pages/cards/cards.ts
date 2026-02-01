import { Component, signal, viewChild, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBar } from '../../components/search-bar/search-bar';
import { CardGridComponent } from '../../components/card-grid/card-grid';
import { CardItemComponent } from '../../components/card-item/card-item';
import { IPokemon } from '../../components/interfaces/i-pokemon';
import { computed } from '@angular/core';
import { PokemonSDK } from '../../services/pokemon-sdk';

@Component({
  selector: 'app-cards',
  imports: [CommonModule, SearchBar, CardGridComponent, CardItemComponent],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  standalone: true
})
export class Cards {
  private service = inject(PokemonSDK);
  searchBarComponent = viewChild(SearchBar);
  selectedCardIndex: WritableSignal<number | null> = signal(null);
  selectedCard: WritableSignal<IPokemon | null> = signal(null);
  isLoadingDetails: WritableSignal<boolean> = signal(false);

  /**
   * Metodo per hover sulle carte, cosi rimangono in primo piano
   * @param index 
   */
  onCardHover(index: number) {
    this.selectedCardIndex.set(index);
  }

  cardsWithImages = computed(() => {
    const searchBar = this.searchBarComponent();
    if (!searchBar) return [];
    const results = searchBar.searchResults();
    return results.filter((card: IPokemon) => card.image);
  });

  hasSearched = computed(() => {
    const searchBar = this.searchBarComponent();
    return (searchBar?.searchResults().length ?? 0) > 0;
  });

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