import { Module } from '@nestjs/common';
import { AgencyPartnerSalonsService } from './agency-partner-salons.service';
import { AgencyPartnerSalonsController } from './agency-partner-salons.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AgencyPartnerSalonsController],
  providers: [AgencyPartnerSalonsService, PrismaService, JwtService],
})
export class AgencyPartnerSalonsModule {}
