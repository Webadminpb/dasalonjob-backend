import { Test, TestingModule } from '@nestjs/testing';
import { PartnerVenueController } from './partner-venue.controller';
import { PartnerVenueService } from './partner-venue.service';

describe('PartnerVenueController', () => {
  let controller: PartnerVenueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerVenueController],
      providers: [PartnerVenueService],
    }).compile();

    controller = module.get<PartnerVenueController>(PartnerVenueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
