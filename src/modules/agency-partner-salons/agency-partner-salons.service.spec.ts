import { Test, TestingModule } from '@nestjs/testing';
import { AgencyPartnerSalonsService } from './agency-partner-salons.service';

describe('AgencyPartnerSalonsService', () => {
  let service: AgencyPartnerSalonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyPartnerSalonsService],
    }).compile();

    service = module.get<AgencyPartnerSalonsService>(AgencyPartnerSalonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
