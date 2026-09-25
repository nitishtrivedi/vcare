import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteInauguration } from './site-inauguration';

describe('SiteInauguration', () => {
  let component: SiteInauguration;
  let fixture: ComponentFixture<SiteInauguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteInauguration],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteInauguration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
