export interface IPokemon {
  category: string
  id: string
  illustrator: string
  image: string
  localId: string
  name: string
  rarity: string
  set: Set
  variants: Variants
  variants_detailed: VariantsDetailed[]
  dexId: number[]
  hp: number
  types: string[]
  stage: string
  attacks: Attack[]
  weaknesses: Weakness[]
  legal: Legal
  updated: string
  pricing: Pricing
}

export interface Set {
  cardCount: CardCount
  id: string
  logo: string
  name: string
  symbol: string
}

export interface CardCount {
  official: number
  total: number
}

export interface Variants {
  firstEdition: boolean
  holo: boolean
  normal: boolean
  reverse: boolean
  wPromo: boolean
}

export interface VariantsDetailed {
  type: string
  size: string
}

export interface Attack {
  cost: string[]
  name: string
  effect: string
  damage?: number
}

export interface Weakness {
  type: string
  value: string
}

export interface Legal {
  standard: boolean
  expanded: boolean
}

export interface Pricing {
  cardmarket: any
  tcgplayer: any
}
