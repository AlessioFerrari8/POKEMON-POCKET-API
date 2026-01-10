import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardItem } from './card-item';

describe('CardItem', () => {
  let component: CardItem;
  let fixture: ComponentFixture<CardItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
