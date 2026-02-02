import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Cards } from './pages/cards/cards';
import { Decks } from './pages/decks/decks';
import { MissingCards } from './pages/missing-cards/missing-cards';
import { ExpansionDetail } from './pages/expansion-detail/expansion-detail';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'cards', component: Cards, canActivate: [authGuard] },
  { path: 'decks', component: Decks, canActivate: [authGuard] },
  { path: 'missing-cards', component: MissingCards, canActivate: [authGuard] },
  { path: 'expansion/:id', component: ExpansionDetail, canActivate: [authGuard] },
  { path: '**', redirectTo: 'home' }
];