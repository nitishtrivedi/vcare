import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramDay } from './program-day';

describe('ProgramDay', () => {
  let component: ProgramDay;
  let fixture: ComponentFixture<ProgramDay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramDay],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramDay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
