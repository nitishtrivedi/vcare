import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramNutrition } from './program-nutrition';

describe('ProgramNutrition', () => {
  let component: ProgramNutrition;
  let fixture: ComponentFixture<ProgramNutrition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramNutrition],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramNutrition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
