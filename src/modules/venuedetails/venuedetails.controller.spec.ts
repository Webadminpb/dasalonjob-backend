import { Test, TestingModule } from '@nestjs/testing';
import { VenuedetailsController } from './venuedetails.controller';
import { VenuedetailsService } from './venuedetails.service';

describe('VenuedetailsController', () => {
  let controller: VenuedetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VenuedetailsController],
      providers: [VenuedetailsService],
    }).compile();

    controller = module.get<VenuedetailsController>(VenuedetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
