import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramMoments } from './program-moments';

describe('ProgramMoments', () => {
  let component: ProgramMoments;
  let fixture: ComponentFixture<ProgramMoments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramMoments],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramMoments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
