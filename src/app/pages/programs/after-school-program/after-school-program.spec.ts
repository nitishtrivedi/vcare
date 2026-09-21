import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AfterSchoolProgram } from './after-school-program';

describe('AfterSchoolProgram', () => {
  let component: AfterSchoolProgram;
  let fixture: ComponentFixture<AfterSchoolProgram>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfterSchoolProgram],
    }).compileComponents();

    fixture = TestBed.createComponent(AfterSchoolProgram);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
