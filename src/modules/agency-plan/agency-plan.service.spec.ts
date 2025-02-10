import { Test, TestingModule } from '@nestjs/testing';
import { AgencyPlanService } from './agency-plan.service';

describe('AgencyPlanService', () => {
  let service: AgencyPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyPlanService],
    }).compile();

    service = module.get<AgencyPlanService>(AgencyPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
