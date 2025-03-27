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
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { QueryJobPostDto } from './dto/query-job-post.dto';
import { CreateJobStatusDto } from './dto/status-job-post.dto';

@ApiTags('partner')
@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  // For Partner
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  create(@Body() body: CreateJobPostDto, @GetUser() user: Auth) {
    return this.jobPostService.create(body, user);
  }

  // For Partner
  @Get('p-query')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyJobPost(@GetUser() user: Auth, @Query() query: QueryJobPostDto) {
    return this.jobPostService.findAll(query, user);
  }

  // For Applicant
  @Get('u-query')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findJobPosts(@Query() query: QueryJobPostDto) {
    return this.jobPostService.findAll(query);
  }

  // For Partner
  @Get('deadline-jobs')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  getJobApplicationTotal(
    @GetUser() user: Auth,
    @Query() query: QueryJobPostDto,
  ) {
    return this.jobPostService.findExpiringJobs(query, user);
  }

  @Get('/partner/:id')
  @HttpCode(HttpStatus.OK)
  findOneFor(@Param('id') id: string) {
    return this.jobPostService.findOneForPartner(id);
  }

  @Get('/applicant/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.jobPostService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  update(
    @Body() body: UpdateJobPostDto,
    @GetUser() user: Auth,
    @Param('id') id: string,
  ) {
    return this.jobPostService.update(id, user, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.jobPostService.remove(id, user);
  }

  // For Admin
  @Get('admin/total/job-status')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  getJobStatusTotal() {
    return this.jobPostService.getJobStatusTotal();
  }

  @Patch('admin/status')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  updateJobPostStatusByIdForAdmin(@Body() body: CreateJobStatusDto) {
    return this.jobPostService.updateJobPostStatusByIdForAdmin(body);
  }

  // For Applicant
  @Get('admin-query')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  findJobPostsForAdmin(@Query() query: QueryJobPostDto) {
    return this.jobPostService.findAllForAdmin(query);
  }
}
