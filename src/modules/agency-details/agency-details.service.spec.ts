import { Test, TestingModule } from '@nestjs/testing';
import { AgencyDetailsService } from './agency-details.service';

describe('AgencyDetailsService', () => {
  let service: AgencyDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyDetailsService],
    }).compile();

    service = module.get<AgencyDetailsService>(AgencyDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
