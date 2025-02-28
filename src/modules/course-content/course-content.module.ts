import { Module } from '@nestjs/common';
import { CourseContentService } from './course-content.service';
import { CourseContentController } from './course-content.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CourseContentController],
  providers: [CourseContentService, PrismaService, JwtService],
})
export class CourseContentModule {}
