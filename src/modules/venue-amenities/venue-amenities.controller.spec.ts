import { Test, TestingModule } from '@nestjs/testing';
import { VenueAmenitiesController } from './venue-amenities.controller';
import { VenueAmenitiesService } from './venue-amenities.service';

describe('VenueAmenitiesController', () => {
  let controller: VenueAmenitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VenueAmenitiesController],
      providers: [VenueAmenitiesService],
    }).compile();

    controller = module.get<VenueAmenitiesController>(VenueAmenitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
