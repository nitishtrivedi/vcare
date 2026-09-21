import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutUsGallery } from './about-us-gallery';

describe('AboutUsGallery', () => {
  let component: AboutUsGallery;
  let fixture: ComponentFixture<AboutUsGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsGallery],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsGallery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
