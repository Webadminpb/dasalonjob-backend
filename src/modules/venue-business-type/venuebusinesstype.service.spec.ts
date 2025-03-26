import { Test, TestingModule } from '@nestjs/testing';
import { VenuebusinesstypeService } from './venuebusinesstype.service';

describe('VenuebusinesstypeService', () => {
  let service: VenuebusinesstypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VenuebusinesstypeService],
    }).compile();

    service = module.get<VenuebusinesstypeService>(VenuebusinesstypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
