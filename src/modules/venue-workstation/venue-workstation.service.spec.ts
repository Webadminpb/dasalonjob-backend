import { Test, TestingModule } from '@nestjs/testing';
import { VenueWorkstationService } from './venue-workstation.service';

describe('VenueWorkstationService', () => {
  let service: VenueWorkstationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VenueWorkstationService],
    }).compile();

    service = module.get<VenueWorkstationService>(VenueWorkstationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
