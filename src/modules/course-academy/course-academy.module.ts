import { Module } from '@nestjs/common';
import { CourseAcademyService } from './course-academy.service';
import { CourseAcademyController } from './course-academy.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CourseAcademyController],
  providers: [CourseAcademyService, PrismaService, JwtService],
})
export class CourseAcademyModule {}
