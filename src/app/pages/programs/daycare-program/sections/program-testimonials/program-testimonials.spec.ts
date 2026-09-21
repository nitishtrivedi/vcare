import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramTestimonials } from './program-testimonials';

describe('ProgramTestimonials', () => {
  let component: ProgramTestimonials;
  let fixture: ComponentFixture<ProgramTestimonials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramTestimonials],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramTestimonials);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
