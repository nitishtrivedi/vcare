import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramPillars } from './program-pillars';

describe('ProgramPillars', () => {
  let component: ProgramPillars;
  let fixture: ComponentFixture<ProgramPillars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramPillars],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramPillars);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
