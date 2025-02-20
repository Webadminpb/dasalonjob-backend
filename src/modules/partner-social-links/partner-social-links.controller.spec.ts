import { Test, TestingModule } from '@nestjs/testing';
import { PartnerSocialLinksController } from './partner-social-links.controller';
import { PartnerSocialLinksService } from './partner-social-links.service';

describe('PartnerSocialLinksController', () => {
  let controller: PartnerSocialLinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerSocialLinksController],
      providers: [PartnerSocialLinksService],
    }).compile();

    controller = module.get<PartnerSocialLinksController>(PartnerSocialLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
