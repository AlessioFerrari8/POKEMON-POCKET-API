import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { PokemonSDK } from '../../services/pokemon-sdk';
import { IPokemon } from '../../components/interfaces/i-pokemon';
import { ActivatedRoute, Router } from '@angular/router';
import { CardGridComponent } from '../../components/card-grid/card-grid';


@Component({
  selector: 'app-expansion-detail',
  standalone: true,
  imports: [CommonModule, CardGridComponent],
  templateUrl: './expansion-detail.html',
  styleUrl: './expansion-detail.css',
})
export class ExpansionDetail {
  private service = inject(PokemonSDK);
  private router = inject(Router);

  expansionSets = [
    { id: 'A1', name: 'Genetic Apex' },
    { id: 'A1a', name: 'Mythical Island' },
    { id: 'A2', name: 'Space-Time Smackdown' },
    { id: 'A2a', name: 'Triumphant Light' },
    { id: 'A2b', name: 'Shining Revelry' },
    { id: 'A3', name: 'Celestial Guardians' },
    { id: 'A3a', name: 'Extradimensional Crisis' },
    { id: 'A3b', name: 'Eevee Groove' },
    { id: 'A4', name: 'Wisdom of Sea and Sky' },
    { id: 'A4a', name: 'Secluded Springs' },
    { id: 'B1', name: 'Mega Rising' },
    { id: 'B1a', name: 'Crimson Blaze' },
  ];

  selectedExpansion: WritableSignal<string | null> = signal(null);
  cards: WritableSignal<IPokemon[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);

  ExpansionClick(expansionId: string): void {
    this.selectedExpansion.set(expansionId);
    this.loadCards(expansionId);
    // mostro ogni volta l'id 
    this.router.navigate(['/expansion', expansionId]);
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

}

