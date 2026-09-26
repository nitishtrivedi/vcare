import { TestBed } from '@angular/core/testing';

import { VcareGenie } from './vcare-genie';

describe('VcareGenie', () => {
  let service: VcareGenie;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VcareGenie);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
