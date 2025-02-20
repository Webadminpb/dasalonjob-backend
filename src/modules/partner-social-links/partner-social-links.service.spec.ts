import { Test, TestingModule } from '@nestjs/testing';
import { PartnerSocialLinksService } from './partner-social-links.service';

describe('PartnerSocialLinksService', () => {
  let service: PartnerSocialLinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerSocialLinksService],
    }).compile();

    service = module.get<PartnerSocialLinksService>(PartnerSocialLinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
