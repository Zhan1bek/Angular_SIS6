import { TestBed } from '@angular/core/testing';

import { SpacexService } from './spacex';

describe('Spacex', () => {
  let service: SpacexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpacexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
