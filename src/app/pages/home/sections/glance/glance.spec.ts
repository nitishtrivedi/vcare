import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Glance } from './glance';

describe('Glance', () => {
  let component: Glance;
  let fixture: ComponentFixture<Glance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Glance],
    }).compileComponents();

    fixture = TestBed.createComponent(Glance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
