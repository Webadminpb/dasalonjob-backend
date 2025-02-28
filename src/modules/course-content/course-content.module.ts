import { Module } from '@nestjs/common';
import { CourseContentService } from './course-content.service';
import { CourseContentController } from './course-content.controller';

@Module({
  controllers: [CourseContentController],
  providers: [CourseContentService],
})
export class CourseContentModule {}
