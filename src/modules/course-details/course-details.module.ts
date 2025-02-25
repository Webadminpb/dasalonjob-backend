import { Module } from '@nestjs/common';
import { CourseDetailsService } from './course-details.service';
import { CourseDetailsController } from './course-details.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CourseDetailsController],
  providers: [CourseDetailsService, PrismaService, JwtService],
})
export class CourseDetailsModule {}
