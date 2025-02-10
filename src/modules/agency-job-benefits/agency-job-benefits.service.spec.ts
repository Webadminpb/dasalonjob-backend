import { Test, TestingModule } from '@nestjs/testing';
import { AgencyJobBenefitsService } from './agency-job-benefits.service';

describe('AgencyJobBenefitsService', () => {
  let service: AgencyJobBenefitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyJobBenefitsService],
    }).compile();

    service = module.get<AgencyJobBenefitsService>(AgencyJobBenefitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
