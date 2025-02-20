import { Module } from '@nestjs/common';
import { PartnerSocialLinksService } from './partner-social-links.service';
import { PartnerSocialLinksController } from './partner-social-links.controller';

@Module({
  controllers: [PartnerSocialLinksController],
  providers: [PartnerSocialLinksService],
})
export class PartnerSocialLinksModule {}
