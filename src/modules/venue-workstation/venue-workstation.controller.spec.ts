import { Test, TestingModule } from '@nestjs/testing';
import { VenueWorkstationController } from './venue-workstation.controller';
import { VenueWorkstationService } from './venue-workstation.service';

describe('VenueWorkstationController', () => {
  let controller: VenueWorkstationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VenueWorkstationController],
      providers: [VenueWorkstationService],
    }).compile();

    controller = module.get<VenueWorkstationController>(VenueWorkstationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
