import { Test, TestingModule } from '@nestjs/testing';
import { VenuedetailsService } from './venuedetails.service';

describe('VenuedetailsService', () => {
  let service: VenuedetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VenuedetailsService],
    }).compile();

    service = module.get<VenuedetailsService>(VenuedetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
