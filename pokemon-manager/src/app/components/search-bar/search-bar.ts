import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PokemonSDK } from '../../services/pokemon-sdk';
import { IPokemon } from '../interfaces/i-pokemon';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  private service = inject(PokemonSDK);

  public searchResults: WritableSignal<IPokemon[]> = signal([]);
  public isLoading: WritableSignal<boolean> = signal(false);
  public errorMessage: WritableSignal<string> = signal('');

  inputName = new FormControl<string>('', { nonNullable: true });

  performSearchOnClick(): void {
    const query = this.inputName.value.trim();
    
    if (!query) {
      this.searchResults.set([]);
      this.errorMessage.set('');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.service.searchCards(query).subscribe({
      next: (cards) => {
        this.searchResults.set(cards);
        this.isLoading.set(false);
        if (cards.length === 0) {
          this.errorMessage.set(`No results found for "${query}"`);
        }
      },
      error: (err) => {
        console.error('Search error:', err);
        this.searchResults.set([]);
        this.errorMessage.set('Error searching. Try again.');
        this.isLoading.set(false);
      }
    });
  }
}