import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompararJogadores } from './comparar-jogadores';

describe('CompararJogadores', () => {
  let component: CompararJogadores;
  let fixture: ComponentFixture<CompararJogadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompararJogadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompararJogadores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
