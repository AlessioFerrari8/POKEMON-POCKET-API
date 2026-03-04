import { ILightPokemon } from './i-light-pokemon';

export interface IDeck {
  id: string;
  name: string;
  cards: ILightPokemon[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
