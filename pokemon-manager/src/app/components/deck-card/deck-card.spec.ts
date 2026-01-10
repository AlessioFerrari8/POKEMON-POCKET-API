import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckCard } from './deck-card';

describe('DeckCard', () => {
  let component: DeckCard;
  let fixture: ComponentFixture<DeckCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
