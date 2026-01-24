import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { PokemonSDK } from '../../services/pokemon-sdk';
import { Root } from '../../components/interfaces/i-pokemon';
import { ActivatedRoute, Router } from '@angular/router';
import { CardGridComponent } from '../../components/card-grid/card-grid';


@Component({
  selector: 'app-expansion-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expansion-detail.html',
  styleUrl: './expansion-detail.css',
})
export class ExpansionDetail {
  private service = inject(PokemonSDK);

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

}
