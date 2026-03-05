import { ILightPokemon } from "./i-light-pokemon";
import { IDeck } from "./i-deck";

export type AppLanguage = 'it' | 'en';

export interface IUserSettings {
  language: AppLanguage;
  useGoogleTranslate?: boolean;
}

export interface IUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  nickname?: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  cardsOwnedCount?: number;
  ownedCards?: string[]; // lista degli id delle carte segnate come owned
  missingCards?: ILightPokemon[];
  decks?: IDeck[]; // mazzi salvati 
  settings?: IUserSettings;
}
