import { Test, TestingModule } from '@nestjs/testing';
import { AgencyJobBasicInfoService } from './agency-job-basic-info.service';

describe('AgencyJobBasicInfoService', () => {
  let service: AgencyJobBasicInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyJobBasicInfoService],
    }).compile();

    service = module.get<AgencyJobBasicInfoService>(AgencyJobBasicInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
