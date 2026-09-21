import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramHighlights } from './program-highlights';

describe('ProgramHighlights', () => {
  let component: ProgramHighlights;
  let fixture: ComponentFixture<ProgramHighlights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramHighlights],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramHighlights);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
