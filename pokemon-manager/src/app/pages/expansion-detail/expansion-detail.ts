import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { PokemonSDK } from '../../services/pokemon-sdk';
import { Root } from '../../components/interfaces/i-pokemon';

@Component({
  selector: 'app-expansion-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expansion-detail.html',
  styleUrl: './expansion-detail.css',
})
export class ExpansionDetail implements OnInit {
  private service = inject(PokemonSDK);

  cards: WritableSignal<Root[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(true);
  setName: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.loadSet();
  }

  loadSet(): void {
    this.isLoading.set(true);
    this.service.getSet('A1').subscribe({
      next: (setData) => {
        if (setData) {
          this.setName.set(setData.name || 'A1 Set');
          const cardsWithImages = setData.cards?.filter((card: Root) => card.image) || [];
          this.cards.set(cardsWithImages);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading set:', err);
        this.cards.set([]);
        this.isLoading.set(false);
      }
    });
  }
}
