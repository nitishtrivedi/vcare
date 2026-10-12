import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramAura } from './program-aura';

describe('ProgramAura', () => {
  let component: ProgramAura;
  let fixture: ComponentFixture<ProgramAura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramAura],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramAura);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
