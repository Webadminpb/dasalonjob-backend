import { Test, TestingModule } from '@nestjs/testing';
import { VenueAmenitiesService } from './venue-amenities.service';

describe('VenueAmenitiesService', () => {
  let service: VenueAmenitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VenueAmenitiesService],
    }).compile();

    service = module.get<VenueAmenitiesService>(VenueAmenitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
