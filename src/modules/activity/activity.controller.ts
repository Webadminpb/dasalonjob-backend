import { Controller, Get, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { QueryActivityDto } from './dto/query-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('admin/applicant')
  getAllActivitiesForApplicant(@Query() query: QueryActivityDto) {
    return this.activityService.getAllActivitiesForApplicant(query);
  }
  @Get('admin/partner')
  getAllActivitiesForPartner(@Query() query: QueryActivityDto) {
    return this.activityService.getAllActivitiesForPartner(query);
  }
}
