import { Test, TestingModule } from '@nestjs/testing';
import { AgencyDetailsController } from './agency-details.controller';
import { AgencyDetailsService } from './agency-details.service';

describe('AgencyDetailsController', () => {
  let controller: AgencyDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyDetailsController],
      providers: [AgencyDetailsService],
    }).compile();

    controller = module.get<AgencyDetailsController>(AgencyDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
