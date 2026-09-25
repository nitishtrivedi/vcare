import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutUsSchoolAdvisory } from './about-us-school-advisory';

describe('AboutUsSchoolAdvisory', () => {
  let component: AboutUsSchoolAdvisory;
  let fixture: ComponentFixture<AboutUsSchoolAdvisory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsSchoolAdvisory],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsSchoolAdvisory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
