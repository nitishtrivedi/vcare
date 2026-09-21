import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramBenefits } from './program-benefits';

describe('ProgramBenefits', () => {
  let component: ProgramBenefits;
  let fixture: ComponentFixture<ProgramBenefits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramBenefits],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramBenefits);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
