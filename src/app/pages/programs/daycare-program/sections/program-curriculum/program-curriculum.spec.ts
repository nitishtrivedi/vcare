import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramCurriculum } from './program-curriculum';

describe('ProgramCurriculum', () => {
  let component: ProgramCurriculum;
  let fixture: ComponentFixture<ProgramCurriculum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramCurriculum],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramCurriculum);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
