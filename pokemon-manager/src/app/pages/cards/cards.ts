import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBar } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-cards',
  imports: [CommonModule, SearchBar],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  standalone: true
})

export class Cards {
  searchBar = viewChild.required(SearchBar);

  onImageError(card: any) {
    console.log('Errore immagine:', card.name, card.set?.id, card.localId);
  }
  
  onImageLoad(card: any) {
    console.log('Immagine caricata:', card.name);
  }
}