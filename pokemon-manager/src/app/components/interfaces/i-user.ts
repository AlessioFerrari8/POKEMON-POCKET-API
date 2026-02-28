import { IPokemon } from "./i-pokemon";

export interface IUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  cardsOwnedCount?: number; // non necessariamente cè
  missingCards?: IPokemon[];
}
