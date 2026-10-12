import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramStudio } from './program-studio';

describe('ProgramStudio', () => {
  let component: ProgramStudio;
  let fixture: ComponentFixture<ProgramStudio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramStudio],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramStudio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
