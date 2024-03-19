import { TestBed } from '@angular/core/testing';

import { MatrixAndVectorService } from './matrix-and-vector-service';

describe('MatrixAndVectorServiceService', () => {
  let service: MatrixAndVectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrixAndVectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
