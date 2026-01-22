import { Component, viewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBar } from '../../components/search-bar/search-bar';
import { PokemonSDK } from '../../services/pokemon-sdk';

@Component({
  selector: 'app-cards',
  imports: [CommonModule, SearchBar],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  standalone: true
})
export class Cards implements OnInit {
  searchBar = viewChild.required(SearchBar);

  constructor(private pokemonService: PokemonSDK) {}

  ngOnInit(): void {
    // DEBUG: Carica subito tutte le carte per vedere cosa succede
    console.log('🚀 Starting debug...');
    
    this.pokemonService.getPocketCards().subscribe(cards => {
      console.log('=== DEBUG RESULTS ===');
      console.log('Total Pocket cards:', cards.length);
      
      if (cards.length > 0) {
        console.log('First 3 cards:', cards.slice(0, 3).map(c => ({
          name: c.name,
          category: c.category,
          set: c.set?.name
        })));
      } else {
        console.error('⚠️ NO CARDS FOUND! The category filter is probably wrong.');
      }
    });
  }

  onImageError(card: any) {
    console.log('Errore immagine:', card.name, card.set?.id, card.localId);
  }
  
  onImageLoad(card: any) {
    console.log('Immagine caricata:', card.name);
  }
}