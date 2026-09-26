import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VCareGenie } from './vcare-genie';

describe('VcareGenie', () => {
  let component: VCareGenie;
  let fixture: ComponentFixture<VCareGenie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VCareGenie],
    }).compileComponents();

    fixture = TestBed.createComponent(VCareGenie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
