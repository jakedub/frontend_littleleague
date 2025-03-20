import { TestBed } from '@angular/core/testing';

import { PlayerDivisionService } from './player-division.service';

describe('PlayerDivisionService', () => {
  let service: PlayerDivisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerDivisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
