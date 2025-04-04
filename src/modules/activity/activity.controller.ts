import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { QueryActivityDto } from './dto/query-activity.dto';
import { AllowAuthenticated } from 'src/common/decorators/auth-decorator';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('admin/')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  getAllActivitiesForApplicant(@Query() query: QueryActivityDto) {
    return this.activityService.getAllActivities(query);
  }
}
