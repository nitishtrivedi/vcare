import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramMission } from './program-mission';

describe('ProgramMission', () => {
  let component: ProgramMission;
  let fixture: ComponentFixture<ProgramMission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramMission],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramMission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
