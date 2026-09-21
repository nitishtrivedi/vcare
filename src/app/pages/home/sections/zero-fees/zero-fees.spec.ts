import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZeroFee } from './zero-fee';

describe('ZeroFee', () => {
  let component: ZeroFee;
  let fixture: ComponentFixture<ZeroFee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZeroFee],
    }).compileComponents();

    fixture = TestBed.createComponent(ZeroFee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
