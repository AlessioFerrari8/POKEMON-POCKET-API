import { Set } from './i-pokemon';

export interface ILightPokemon {
  category: string
  id: string
  illustrator: string
  image: string
  localId: string
  name: string
  rarity: string
  set: Set
  dexId: number[]
  hp: number
  types: string[]
  stage: string
}

