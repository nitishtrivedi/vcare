import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramLearnings } from './program-learnings';

describe('ProgramLearnings', () => {
  let component: ProgramLearnings;
  let fixture: ComponentFixture<ProgramLearnings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramLearnings],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramLearnings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
