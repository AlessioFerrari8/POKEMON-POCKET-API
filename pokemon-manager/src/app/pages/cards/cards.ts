import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBar } from '../../components/search-bar/search-bar';
import { IPokemon } from '../../components/interfaces/i-pokemon';
import { computed } from '@angular/core';

@Component({
  selector: 'app-cards',
  imports: [CommonModule, SearchBar],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  standalone: true
})
export class Cards {
  searchBarComponent = viewChild(SearchBar);
  
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
}