import { Test, TestingModule } from '@nestjs/testing';
import { AgencyVenueDetailsService } from './agency-venue-details.service';

describe('AgencyVenueDetailsService', () => {
  let service: AgencyVenueDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyVenueDetailsService],
    }).compile();

    service = module.get<AgencyVenueDetailsService>(AgencyVenueDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
