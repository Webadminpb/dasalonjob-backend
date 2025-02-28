import { Module } from '@nestjs/common';
import { CourseTypeAndLocationService } from './course-type-and-location.service';
import { CourseTypeAndLocationController } from './course-type-and-location.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CourseTypeAndLocationController],
  providers: [CourseTypeAndLocationService, PrismaService, JwtService],
})
export class CourseTypeAndLocationModule {}
