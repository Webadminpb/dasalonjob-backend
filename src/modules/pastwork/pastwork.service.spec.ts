import { Test, TestingModule } from '@nestjs/testing';
import { PastworkService } from './pastwork.service';

describe('PastworkService', () => {
  let service: PastworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PastworkService],
    }).compile();

    service = module.get<PastworkService>(PastworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
