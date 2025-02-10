import { Module } from '@nestjs/common';
import { AgencyDetailsService } from './agency-details.service';
import { AgencyDetailsController } from './agency-details.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AgencyDetailsController],
  providers: [AgencyDetailsService, PrismaService, JwtService],
})
export class AgencyDetailsModule {}
