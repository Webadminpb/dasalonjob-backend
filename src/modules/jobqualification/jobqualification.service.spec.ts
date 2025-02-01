import { Test, TestingModule } from '@nestjs/testing';
import { JobqualificationService } from './jobqualification.service';

describe('JobqualificationService', () => {
  let service: JobqualificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobqualificationService],
    }).compile();

    service = module.get<JobqualificationService>(JobqualificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
