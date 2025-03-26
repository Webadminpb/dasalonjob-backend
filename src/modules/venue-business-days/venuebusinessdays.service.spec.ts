import { Test, TestingModule } from '@nestjs/testing';
import { VenuebusinessdaysService } from './venuebusinessdays.service';

describe('VenuebusinessdaysService', () => {
  let service: VenuebusinessdaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VenuebusinessdaysService],
    }).compile();

    service = module.get<VenuebusinessdaysService>(VenuebusinessdaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
