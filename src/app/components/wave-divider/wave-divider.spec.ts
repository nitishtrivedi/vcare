import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveDivider } from './wave-divider';

describe('WaveDivider', () => {
  let component: WaveDivider;
  let fixture: ComponentFixture<WaveDivider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveDivider],
    }).compileComponents();

    fixture = TestBed.createComponent(WaveDivider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
