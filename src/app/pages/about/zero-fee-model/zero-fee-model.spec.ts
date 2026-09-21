import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZeroFeeModel } from './zero-fee-model';

describe('ZeroFeeModel', () => {
  let component: ZeroFeeModel;
  let fixture: ComponentFixture<ZeroFeeModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZeroFeeModel],
    }).compileComponents();

    fixture = TestBed.createComponent(ZeroFeeModel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
