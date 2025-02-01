import { Test, TestingModule } from '@nestjs/testing';
import { JobbasicinfoService } from './jobbasicinfo.service';

describe('JobbasicinfoService', () => {
  let service: JobbasicinfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobbasicinfoService],
    }).compile();

    service = module.get<JobbasicinfoService>(JobbasicinfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
