import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramFacts } from './program-facts';

describe('ProgramFacts', () => {
  let component: ProgramFacts;
  let fixture: ComponentFixture<ProgramFacts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramFacts],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramFacts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
