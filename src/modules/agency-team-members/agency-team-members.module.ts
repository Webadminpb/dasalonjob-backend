import { Module } from '@nestjs/common';
import { AgencyTeamController } from './agency-team-members.controller';
import { AgencyTeamService } from './agency-team-members.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AgencyTeamController],
  providers: [AgencyTeamService, PrismaService, JwtService],
})
export class AgencyTeamMembersModule {}
