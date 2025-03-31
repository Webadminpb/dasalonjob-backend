import { Module } from '@nestjs/common';
import { AgencyPersonalDetailsService } from './agency-personal-details.service';
import { AgencyPersonalDetailsController } from './agency-personal-details.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AgencyPersonalDetailsController],
  providers: [AgencyPersonalDetailsService, PrismaService, JwtService],
})
export class AgencyPersonalDetailsModule {}
