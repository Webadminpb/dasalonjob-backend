import { Test, TestingModule } from '@nestjs/testing';
import { JobbenefitsService } from './jobbenefits.service';

describe('JobbenefitsService', () => {
  let service: JobbenefitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobbenefitsService],
    }).compile();

    service = module.get<JobbenefitsService>(JobbenefitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
