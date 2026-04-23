import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Playercard } from './playercard';

describe('Playercard', () => {
  let component: Playercard;
  let fixture: ComponentFixture<Playercard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Playercard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Playercard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
