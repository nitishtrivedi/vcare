import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreschoolProgram } from './preschool-program';

describe('PreschoolProgram', () => {
  let component: PreschoolProgram;
  let fixture: ComponentFixture<PreschoolProgram>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreschoolProgram],
    }).compileComponents();

    fixture = TestBed.createComponent(PreschoolProgram);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
