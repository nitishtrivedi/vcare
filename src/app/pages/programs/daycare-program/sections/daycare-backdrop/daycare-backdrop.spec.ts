import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareBackdrop } from './daycare-backdrop';

describe('DaycareBackdrop', () => {
  let component: DaycareBackdrop;
  let fixture: ComponentFixture<DaycareBackdrop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaycareBackdrop],
    }).compileComponents();

    fixture = TestBed.createComponent(DaycareBackdrop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
