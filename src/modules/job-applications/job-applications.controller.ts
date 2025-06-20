import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { QueryJobApplicationDto } from './dto/query-job-application.dto';
import { StatusJobApplicationDto } from './dto/status-job.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { JobApplicationService } from './job-applications.service';

@ApiTags('applicant')
@ApiBearerAuth()
@Controller('job-applications')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post('/user')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER')
  create(@Body() body: CreateJobApplicationDto, @GetUser() user: Auth) {
    return this.jobApplicationService.create(body, user);
  }

  @Get('/partner')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'AGENCY')
  findAllForPartner(
    @Query() query: QueryJobApplicationDto,
    @GetUser() user: Auth,
  ) {
    return this.jobApplicationService.findAllForPartner(query, user);
  }

  @Get('/agency')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  findAllForAgency(@Query() query: QueryJobApplicationDto) {
    return this.jobApplicationService.findAllForPartner(query);
  }

  @Get('/admin')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  findAllForAdmin(@Query() query: QueryJobApplicationDto) {
    return this.jobApplicationService.findAllForAdmin(query);
  }

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findAllForApplicant(
    @Query() query: QueryJobApplicationDto,
    @GetUser() user: Auth,
  ) {
    return this.jobApplicationService.findAllForApplicant(query, user);
  }

  @Get('/partner/total')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findTotalJobsAndApplicant(@GetUser() user: Auth) {
    return this.jobApplicationService.findTotalJobsAndApplicant(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.jobApplicationService.findOne(id);
  }

  @Put('/partner/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Param('id') id: string,
    @Body() body: UpdateJobApplicationDto,
    @GetUser() user: Auth,
  ) {
    return this.jobApplicationService.update(id, body, user);
  }

  @Patch('/partner/status/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  updateStatus(
    @Param('id') id: string,
    @Body() body: StatusJobApplicationDto,
    @GetUser() user: Auth,
  ) {
    return this.jobApplicationService.updateStatus(id, body, user);
  }

  @Delete('/partner/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.jobApplicationService.remove(id, user);
  }

  @Get('agency/recents')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  getAgencyRecentApplicants(
    @Query() query: QueryJobApplicationDto,
    @GetUser() user: Auth,
  ) {
    return this.jobApplicationService.getAgencyRecentApplicants(query, user);
  }

  @Get("agency/applicants")
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  getAgencyApplicants(@Query() query: QueryJobApplicationDto, @GetUser() user:Auth){
    return this.jobApplicationService.getAgencyJobApplicants(query, user)
  }
}
