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
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import {
  QueryJobPostDto,
  QueryJobPostDtoForAdmin,
} from './dto/query-job-post.dto';
import { CreateJobStatusDto } from './dto/status-job-post.dto';

@ApiTags('partner')
@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  // For Partner
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN', 'AGENCY')
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
  findJobPosts(@Query() query: QueryJobPostDto, @GetUser() user: Auth) {
    return this.jobPostService.findAllForApplicant(query, user);
  }

  @Get('guest-u-query')
  @HttpCode(HttpStatus.OK)
  findJobPostsForGuest(@Query() query: QueryJobPostDto) {
    return this.jobPostService.findAllForApplicant(query);
  }

  // For Partner
  @Get('deadline-jobs')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'AGENCY')
  getJobApplicationTotal(
    @GetUser() user: Auth,
    @Query() query: QueryJobPostDto,
  ) {
    return this.jobPostService.findExpiringJobs(query, user);
  }

  @Get('/partner/:id')
  @HttpCode(HttpStatus.OK)
  findOneForPartner(@Param('id') id: string) {
    return this.jobPostService.findOneForPartner(id);
  }

  // @Get('/agency/:id')
  // @HttpCode(HttpStatus.OK)
  // findOneForAgency(@Param('id') id: string) {
  //   return this.jobPostService.findOneForPartner(id);
  // }

  @Get('/guest/:id')
  @HttpCode(HttpStatus.OK)
  findOneJobPostForGuest(@Param('id') id: string) {
    return this.jobPostService.findOne(id);
  }

  @Get('/applicant/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findOne(@Param('id') id: string, @GetUser() user: Auth) {
    console.log("params ki id ", id)
    return this.jobPostService.findOne(id, user);
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
  updateJobPostStatusByIdForAdmin(
    @Body() body: CreateJobStatusDto,
    @GetUser() user: Auth,
  ) {
    return this.jobPostService.updateJobPostStatusByIdForAdmin(body, user);
  }

  // For Admin
  @Get('admin-query')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  findJobPostsForAdmin(@Query() query: QueryJobPostDtoForAdmin) {
    return this.jobPostService.findAllForAdmin(query);
  }

  // For Agency
  @Get('agency-query')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN', 'AGENCY')
  findJobPostsForAgency(
    @Query() query: QueryJobPostDto,
    @GetUser() user: Auth,
  ) {
    return this.jobPostService.findAllForAgency(query, user);
  }
}
