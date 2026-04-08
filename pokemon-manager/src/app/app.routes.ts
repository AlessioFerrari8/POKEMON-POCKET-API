import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Cards } from './pages/cards/cards';
import { Decks } from './pages/decks/decks';
import { MissingCards } from './pages/missing-cards/missing-cards';
import { ExpansionDetail } from './pages/expansion-detail/expansion-detail';
import { Login } from './shared/components/login/login';
import { authGuard } from './core/guards/auth.guard';
import { UserProfile } from './shared/components/user-profile/user-profile';
import { Settings } from './shared/components/settings/settings';
import { ROUTES } from './core/constants';

export const routes: Routes = [
  { path: ROUTES.LOGIN, component: Login },
  { path: ROUTES.EMPTY, redirectTo: ROUTES.LOGIN, pathMatch: 'full' },
  { path: ROUTES.HOME, component: Home, canActivate: [authGuard] },
  { path: ROUTES.CARDS, component: Cards, canActivate: [authGuard] },
  { path: ROUTES.DECKS, component: Decks, canActivate: [authGuard] },
  { path: ROUTES.MISSING_CARDS, component: MissingCards, canActivate: [authGuard] },
  { path: `${ROUTES.EXPANSION_DETAIL}/:id`, component: ExpansionDetail, canActivate: [authGuard] },
  { path: ROUTES.USER_PROFILE, component: UserProfile, canActivate: [authGuard] },
  { path: ROUTES.SETTINGS, component: Settings, canActivate: [authGuard] },
  { path: '**', redirectTo: ROUTES.LOGIN }
];