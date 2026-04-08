import { TestBed } from '@angular/core/testing';

import { PokemonSDK } from './pokemon-sdk';

describe('PokemonSDK', () => {
  let service: PokemonSDK;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonSDK);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
