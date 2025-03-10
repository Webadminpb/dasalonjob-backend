import { Module } from '@nestjs/common';
import { PartnerPersonalDataService } from './partner-personal-data.service';
import { PartnerPersonalDataController } from './partner-personal-data.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PartnerPersonalDataController],
  providers: [PartnerPersonalDataService, PrismaService, JwtService],
})
export class PartnerPersonalDataModule {}
