import { Test, TestingModule } from '@nestjs/testing';
import { PartnerPersonalDataService } from './partner-personal-data.service';

describe('PartnerPersonalDataService', () => {
  let service: PartnerPersonalDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerPersonalDataService],
    }).compile();

    service = module.get<PartnerPersonalDataService>(PartnerPersonalDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
