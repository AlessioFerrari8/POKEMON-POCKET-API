import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Cards } from './pages/cards/cards';
import { Decks } from './pages/decks/decks';
import { MissingCards } from './pages/missing-cards/missing-cards';
import { ExpansionDetail } from './pages/expansion-detail/expansion-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'cards', component: Cards },
  { path: 'decks', component: Decks },
  { path: 'missing-cards', component: MissingCards },
  { path: 'expansion/:id', component: ExpansionDetail },
  { path: '**', redirectTo: 'home' }
];