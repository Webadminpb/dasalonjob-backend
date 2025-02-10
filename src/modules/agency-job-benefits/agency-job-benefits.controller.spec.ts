import { Test, TestingModule } from '@nestjs/testing';
import { AgencyJobBenefitsController } from './agency-job-benefits.controller';
import { AgencyJobBenefitsService } from './agency-job-benefits.service';

describe('AgencyJobBenefitsController', () => {
  let controller: AgencyJobBenefitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyJobBenefitsController],
      providers: [AgencyJobBenefitsService],
    }).compile();

    controller = module.get<AgencyJobBenefitsController>(AgencyJobBenefitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
