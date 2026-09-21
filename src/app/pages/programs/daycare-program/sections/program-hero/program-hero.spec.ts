import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramHero } from './program-hero';

describe('ProgramHero', () => {
  let component: ProgramHero;
  let fixture: ComponentFixture<ProgramHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramHero],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
