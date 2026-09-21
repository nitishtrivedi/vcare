import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutUsMission } from './about-us-mission';

describe('AboutUsMission', () => {
  let component: AboutUsMission;
  let fixture: ComponentFixture<AboutUsMission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsMission],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsMission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
