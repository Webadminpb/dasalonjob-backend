import { Test, TestingModule } from '@nestjs/testing';
import { JobpreferenceService } from './jobpreference.service';

describe('JobpreferenceService', () => {
  let service: JobpreferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobpreferenceService],
    }).compile();

    service = module.get<JobpreferenceService>(JobpreferenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
