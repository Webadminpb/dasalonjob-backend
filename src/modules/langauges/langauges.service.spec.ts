import { Test, TestingModule } from '@nestjs/testing';
import { LangaugesService } from './langauges.service';

describe('LangaugesService', () => {
  let service: LangaugesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LangaugesService],
    }).compile();

    service = module.get<LangaugesService>(LangaugesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
