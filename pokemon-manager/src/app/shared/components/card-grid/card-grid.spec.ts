import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGrid } from './card-grid';

describe('CardGrid', () => {
  let component: CardGrid;
  let fixture: ComponentFixture<CardGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
