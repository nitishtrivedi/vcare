import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaBanner } from './media-banner';

describe('MediaBanner', () => {
  let component: MediaBanner;
  let fixture: ComponentFixture<MediaBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
