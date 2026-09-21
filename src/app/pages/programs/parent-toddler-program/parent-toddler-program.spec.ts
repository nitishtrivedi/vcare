import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentToddlerProgram } from './parent-toddler-program';

describe('ParentToddlerProgram', () => {
  let component: ParentToddlerProgram;
  let fixture: ComponentFixture<ParentToddlerProgram>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentToddlerProgram],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentToddlerProgram);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
