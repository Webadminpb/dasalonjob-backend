import { Test, TestingModule } from '@nestjs/testing';
import { VenuebusinessservicesService } from './venuebusinessservices.service';

describe('VenuebusinessservicesService', () => {
  let service: VenuebusinessservicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VenuebusinessservicesService],
    }).compile();

    service = module.get<VenuebusinessservicesService>(VenuebusinessservicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
