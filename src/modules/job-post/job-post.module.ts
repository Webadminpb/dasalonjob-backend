import { Module } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PartnerAgencyPermissionService } from '../partner-agency-job-permission/partner-agency-job-permission.service';

@Module({
  controllers: [JobPostController],
  providers: [
    JobPostService,
    PrismaService,
    JwtService,
    PartnerAgencyPermissionService,
  ],
})
export class JobPostModule {}
