import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramFees } from './program-fees';

describe('ProgramFees', () => {
  let component: ProgramFees;
  let fixture: ComponentFixture<ProgramFees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramFees],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramFees);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
