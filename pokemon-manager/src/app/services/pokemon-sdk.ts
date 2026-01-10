import { Injectable } from '@angular/core';
import TCGdex from '@tcgdex/sdk'

@Injectable({
  providedIn: 'root',
})

export class PokemonSDK {
  private tcgdex: TCGdex; 
  constructor() {
    // init SDK
    this.tcgdex = new TCGdex('en'); // let's use english, maybe then I'll switch to japanese
  }
}
