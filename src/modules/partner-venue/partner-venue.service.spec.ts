import { Test, TestingModule } from '@nestjs/testing';
import { PartnerVenueService } from './partner-venue.service';

describe('PartnerVenueService', () => {
  let service: PartnerVenueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerVenueService],
    }).compile();

    service = module.get<PartnerVenueService>(PartnerVenueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
