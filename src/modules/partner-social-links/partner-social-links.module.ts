import { Module } from '@nestjs/common';
import { PartnerSocialLinksService } from './partner-social-links.service';
import { PartnerSocialLinksController } from './partner-social-links.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PartnerSocialLinksController],
  providers: [PartnerSocialLinksService, PrismaService, JwtService],
})
export class PartnerSocialLinksModule {}
