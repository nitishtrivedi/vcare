import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramSchedule } from './program-schedule';

describe('ProgramSchedule', () => {
  let component: ProgramSchedule;
  let fixture: ComponentFixture<ProgramSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramSchedule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
