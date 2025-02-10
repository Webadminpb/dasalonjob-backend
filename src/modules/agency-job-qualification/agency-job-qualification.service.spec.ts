import { Test, TestingModule } from '@nestjs/testing';
import { AgencyJobQualificationService } from './agency-job-qualification.service';

describe('AgencyJobQualificationService', () => {
  let service: AgencyJobQualificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyJobQualificationService],
    }).compile();

    service = module.get<AgencyJobQualificationService>(AgencyJobQualificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
