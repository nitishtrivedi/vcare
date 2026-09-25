import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnderMaintenance } from './under-maintenance';

describe('UnderMaintenance', () => {
  let component: UnderMaintenance;
  let fixture: ComponentFixture<UnderMaintenance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderMaintenance],
    }).compileComponents();

    fixture = TestBed.createComponent(UnderMaintenance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
