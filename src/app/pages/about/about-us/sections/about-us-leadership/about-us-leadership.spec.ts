import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsLeadership } from './about-us-leadership';

describe('AboutUsLeadership', () => {
  let component: AboutUsLeadership;
  let fixture: ComponentFixture<AboutUsLeadership>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsLeadership],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsLeadership);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
