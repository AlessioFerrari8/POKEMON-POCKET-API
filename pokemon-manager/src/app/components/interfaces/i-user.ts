import { ILightPokemon } from "./i-light-pokemon";

export interface IUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  cardsOwnedCount?: number;
  ownedCards?: string[];       // lista degli id delle carte segnate come owned
  missingCards?: ILightPokemon[];
}
