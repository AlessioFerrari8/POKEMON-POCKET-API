import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PokemonSDK } from '../../services/pokemon-sdk';
import { IPokemon } from '../../components/interfaces/i-pokemon';
import { CardGridComponent } from '../../components/card-grid/card-grid';
import { CardItemComponent } from '../../components/card-item/card-item';

@Component({
  selector: 'app-missing-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardGridComponent, CardItemComponent],
  templateUrl: './missing-cards.html',
  styleUrl: './missing-cards.css',
})
export class MissingCards {
  private service = inject(PokemonSDK);

  filterType = new FormControl<string>('all', { nonNullable: true });
  searchQuery = new FormControl<string>('', { nonNullable: true });
  isDropdownOpen: WritableSignal<boolean> = signal(false);
  cards: WritableSignal<IPokemon[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string> = signal('');
  selectedCard: WritableSignal<IPokemon | null> = signal(null);
  isLoadingDetails: WritableSignal<boolean> = signal(false);

  missingCards: WritableSignal<number> = signal(0);

  filterOptions = [
    { value: 'all', label: 'Others' },
    { value: 'A1', label: 'Genetic Apex' },
    { value: 'A1a', label: 'Mythical Island' },
    { value: 'A2', label: 'Space-Time Smackdown' },
    { value: 'A2a', label: 'Triumphant Light' },
    { value: 'A2b', label: 'Shining Revelry' },
    { value: 'A3', label: 'Celestial Guardians' },
    { value: 'A3a', label: 'Extradimensional Crisis' },
    { value: 'A3b', label: 'Eevee Groove' },
    { value: 'A4', label: 'Wisdom of Sea and Sky' },
    { value: 'A4a', label: 'Secluded Springs' },
    { value: 'B1', label: 'Mega Rising' },
    { value: 'B1a', label: 'Crimson Blaze' }
  ];

  toggleDropdown(): void {
    this.isDropdownOpen.update(val => !val);
  }

  selectFilter(value: string): void {
    this.filterType.setValue(value);
    this.isDropdownOpen.set(false);
  }

  getCurrentFilterLabel(): string {
    const selected = this.filterOptions.find(opt => opt.value === this.filterType.value);
    return selected?.label || 'Filter';
  }

  performSearch(): void {
    const query = this.searchQuery.value.trim();
    const selectedExpansion = this.filterType.value;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const setId = selectedExpansion === 'all' ? 'P-A' : selectedExpansion;

    this.service.getSet(setId).subscribe({
      next: (data) => {
        if (data && data.cards) {
          let filteredCards = data.cards;
          
          // Se c'è una query di ricerca, filtra le carte
          if (query) {
            filteredCards = filteredCards.filter((card: IPokemon) =>
              card.name?.toLowerCase().includes(query.toLowerCase())
            );
          }
          
          this.cards.set(filteredCards);
          
          if (filteredCards.length === 0) {
            this.errorMessage.set(`No cards found for "${query}" in ${this.getCurrentFilterLabel()}`);
          }
        } else {
          this.cards.set([]);
          this.errorMessage.set('Failed to load expansion data');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading expansion:', err);
        this.cards.set([]);
        this.errorMessage.set('Error loading expansion. Try again.');
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
