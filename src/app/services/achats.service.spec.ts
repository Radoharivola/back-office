import { TestBed } from '@angular/core/testing';

import { AchatsService } from './achats.service';

describe('AchatsService', () => {
  let service: AchatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AchatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
