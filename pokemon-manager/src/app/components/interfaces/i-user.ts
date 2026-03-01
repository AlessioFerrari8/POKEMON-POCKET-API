import { IPokemon } from "./i-pokemon";

export interface IUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  cardsOwnedCount?: number; // non necessariamente cè
  ownedCards?: string[];       // lista degli id delle carte segnate come owned
  missingCards?: IPokemon[];
}
