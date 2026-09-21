import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsHero } from './about-us-hero';

describe('AboutUsHero', () => {
  let component: AboutUsHero;
  let fixture: ComponentFixture<AboutUsHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsHero],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
