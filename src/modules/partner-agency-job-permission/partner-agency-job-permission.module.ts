import { Module } from '@nestjs/common';
import { PartnerAgencyPermissionController } from './partner-agency-job-permission.controller';
import { PartnerAgencyPermissionService } from './partner-agency-job-permission.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JobPostService } from '../job-post/job-post.service';

@Module({
  controllers: [PartnerAgencyPermissionController],
  providers: [
    PartnerAgencyPermissionService,
    PrismaService,
    JwtService,
  ],
  exports: [PartnerAgencyPermissionService],
})
export class PartnerAgencyJobPermissionModule {}
