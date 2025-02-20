import { Test, TestingModule } from '@nestjs/testing';
import { SaveJobPostService } from './save-job-post.service';

describe('SaveJobPostService', () => {
  let service: SaveJobPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaveJobPostService],
    }).compile();

    service = module.get<SaveJobPostService>(SaveJobPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
