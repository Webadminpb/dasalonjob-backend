import { Test, TestingModule } from '@nestjs/testing';
import { AgencyVenueDetailsController } from './agency-venue-details.controller';
import { AgencyVenueDetailsService } from './agency-venue-details.service';

describe('AgencyVenueDetailsController', () => {
  let controller: AgencyVenueDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyVenueDetailsController],
      providers: [AgencyVenueDetailsService],
    }).compile();

    controller = module.get<AgencyVenueDetailsController>(AgencyVenueDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
