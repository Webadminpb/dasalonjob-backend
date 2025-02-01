import { Test, TestingModule } from '@nestjs/testing';
import { JobdescriptionService } from './jobdescription.service';

describe('JobdescriptionService', () => {
  let service: JobdescriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobdescriptionService],
    }).compile();

    service = module.get<JobdescriptionService>(JobdescriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
