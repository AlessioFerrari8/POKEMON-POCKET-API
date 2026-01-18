import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBar } from '../../components/search-bar/search-bar';
import { PokemonSDK } from '../../services/pokemon-sdk';
import { CardResume } from '@tcgdex/sdk'; // Importa il tipo corretto

@Component({
  selector: 'app-cards',
  imports: [CommonModule, SearchBar],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  standalone: true
})
export class Cards {
  searchQuery = signal('');
  allCards = signal<CardResume[]>([]); // Usa CardResume invece di Card
  isLoading = signal(false);
  hasSearched = signal(false);

  filteredCards = computed(() => {
    const query = this.searchQuery().toLowerCase();
    
    if (!query) {
      return [];
    }
    
    return this.allCards().filter(card => 
      card.name.toLowerCase().includes(query)
    );
  });

  constructor(private pokemonSDK: PokemonSDK) {
    effect(() => {
      const query = this.searchQuery();
      if (query.length >= 2) {
        this.searchCards(query);
      } else if (query.length === 0) {
        this.allCards.set([]);
        this.hasSearched.set(false);
      }
    });
  }

  async searchCards(query: string) {
    try {
      this.isLoading.set(true);
      this.hasSearched.set(true);
      
      const result = await this.pokemonSDK.searchCards(query);
      
      // Gestisci se è un array o un singolo oggetto
      if (Array.isArray(result)) {
        this.allCards.set(result);
      } else if (result) {
        this.allCards.set([result]); // Converti in array
      } else {
        this.allCards.set([]);
      }
      
    } catch (error) {
      console.error('Error:', error);
      this.allCards.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
  }
}