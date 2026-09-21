import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DaycareProgram } from './daycare-program';

describe('DaycareProgram', () => {
  let component: DaycareProgram;
  let fixture: ComponentFixture<DaycareProgram>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaycareProgram],
    }).compileComponents();

    fixture = TestBed.createComponent(DaycareProgram);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
