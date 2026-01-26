import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-missing-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './missing-cards.html',
  styleUrl: './missing-cards.css',
})
export class MissingCards {
  filterType = new FormControl<string>('all', { nonNullable: true });
  searchQuery = new FormControl<string>('', { nonNullable: true });
  isDropdownOpen: WritableSignal<boolean> = signal(false);

  filterOptions = [
    { value: 'all', label: 'All Expansions' },
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
    console.log('Searching for:', query, 'with filter:', this.filterType.value);
    // Aggiungere logica di ricerca qui
    
  }


}
