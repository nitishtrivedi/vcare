import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsStory } from './about-us-story';

describe('AboutUsStory', () => {
  let component: AboutUsStory;
  let fixture: ComponentFixture<AboutUsStory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsStory],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsStory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
