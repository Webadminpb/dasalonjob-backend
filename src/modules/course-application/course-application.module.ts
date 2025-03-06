import { Module } from '@nestjs/common';
import { CourseApplicationService } from './course-application.service';
import { CourseApplicationController } from './course-application.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CourseApplicationController],
  providers: [CourseApplicationService, PrismaService, JwtService],
})
export class CourseApplicationModule {}
