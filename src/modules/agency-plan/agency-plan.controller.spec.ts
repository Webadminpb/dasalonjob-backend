import { Test, TestingModule } from '@nestjs/testing';
import { AgencyPlanController } from './agency-plan.controller';
import { AgencyPlanService } from './agency-plan.service';

describe('AgencyPlanController', () => {
  let controller: AgencyPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyPlanController],
      providers: [AgencyPlanService],
    }).compile();

    controller = module.get<AgencyPlanController>(AgencyPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
