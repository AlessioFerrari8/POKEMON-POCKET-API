import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionDetail } from './expansion-detail';

describe('ExpansionDetail', () => {
  let component: ExpansionDetail;
  let fixture: ComponentFixture<ExpansionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpansionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpansionDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
