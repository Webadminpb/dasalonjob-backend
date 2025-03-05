import { Module } from '@nestjs/common';
import { SaveCourseService } from './save-course.service';
import { SaveCourseController } from './save-course.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SaveCourseController],
  providers: [SaveCourseService, PrismaService, JwtService],
})
export class SaveCourseModule {}
