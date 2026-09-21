import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramClasses } from './program-classes';

describe('ProgramClasses', () => {
  let component: ProgramClasses;
  let fixture: ComponentFixture<ProgramClasses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramClasses],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramClasses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
