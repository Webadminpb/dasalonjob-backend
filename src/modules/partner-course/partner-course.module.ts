import { Module } from '@nestjs/common';
import { PartnerCourseService } from './partner-course.service';
import { PartnerCourseController } from './partner-course.controller';

@Module({
  controllers: [PartnerCourseController],
  providers: [PartnerCourseService],
})
export class PartnerCourseModule {}
