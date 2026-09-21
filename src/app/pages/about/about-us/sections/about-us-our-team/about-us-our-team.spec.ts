import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsOurTeam } from './about-us-our-team';

describe('AboutUsOurTeam', () => {
  let component: AboutUsOurTeam;
  let fixture: ComponentFixture<AboutUsOurTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsOurTeam],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsOurTeam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
