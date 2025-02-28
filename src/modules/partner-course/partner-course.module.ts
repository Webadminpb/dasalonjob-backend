import { Module } from '@nestjs/common';
import { PartnerCourseService } from './partner-course.service';
import { PartnerCourseController } from './partner-course.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PartnerCourseController],
  providers: [PartnerCourseService, PrismaService, JwtService],
})
export class PartnerCourseModule {}
