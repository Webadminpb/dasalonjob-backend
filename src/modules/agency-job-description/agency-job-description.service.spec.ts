import { Test, TestingModule } from '@nestjs/testing';
import { AgencyJobDescriptionService } from './agency-job-description.service';

describe('AgencyJobDescriptionService', () => {
  let service: AgencyJobDescriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyJobDescriptionService],
    }).compile();

    service = module.get<AgencyJobDescriptionService>(AgencyJobDescriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
