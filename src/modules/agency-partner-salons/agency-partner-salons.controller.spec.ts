import { Test, TestingModule } from '@nestjs/testing';
import { AgencyPartnerSalonsController } from './agency-partner-salons.controller';
import { AgencyPartnerSalonsService } from './agency-partner-salons.service';

describe('AgencyPartnerSalonsController', () => {
  let controller: AgencyPartnerSalonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyPartnerSalonsController],
      providers: [AgencyPartnerSalonsService],
    }).compile();

    controller = module.get<AgencyPartnerSalonsController>(AgencyPartnerSalonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
