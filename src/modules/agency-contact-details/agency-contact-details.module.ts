import { Module } from '@nestjs/common';
import { AgencyContactDetailService } from './agency-contact-details.service';
import { PrismaService } from '../prisma/prisma.service';
import { AgencyContactDetailController } from './agency-contact-details.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [AgencyContactDetailController],
  providers: [AgencyContactDetailService, PrismaService, JwtService],
  exports: [],
})
export class AgencyContactDetailsModule {}
