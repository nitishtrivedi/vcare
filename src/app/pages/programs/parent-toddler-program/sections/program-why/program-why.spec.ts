import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramWhy } from './program-why';

describe('ProgramWhy', () => {
  let component: ProgramWhy;
  let fixture: ComponentFixture<ProgramWhy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramWhy],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramWhy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
