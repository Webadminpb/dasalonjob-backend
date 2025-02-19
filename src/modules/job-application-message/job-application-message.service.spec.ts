import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicationMessageService } from './job-application-message.service';

describe('JobApplicationMessageService', () => {
  let service: JobApplicationMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobApplicationMessageService],
    }).compile();

    service = module.get<JobApplicationMessageService>(JobApplicationMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
