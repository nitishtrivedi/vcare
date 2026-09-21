import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutUsTrust } from './about-us-trust';

describe('AboutUsTrust', () => {
  let component: AboutUsTrust;
  let fixture: ComponentFixture<AboutUsTrust>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsTrust],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsTrust);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
