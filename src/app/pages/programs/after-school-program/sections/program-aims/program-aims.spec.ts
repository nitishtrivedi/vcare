import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramAims } from './program-aims';

describe('ProgramAims', () => {
  let component: ProgramAims;
  let fixture: ComponentFixture<ProgramAims>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramAims],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramAims);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
