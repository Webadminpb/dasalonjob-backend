import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

@ApiTags('partner')
@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateJobPostDto, @GetUser() user: Auth) {
    return this.jobPostService.create(body, user);
  }

  @Get('p-query')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyJobPost(@GetUser() user: Auth, @Query() query: QueryJobPostDto) {
    return this.jobPostService.findAll(query, user);
  }

  @Get('u-query')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findJobPosts(@Query() query: QueryJobPostDto) {
    return this.jobPostService.findAll(query);
  }

  @Get('deadline-jobs')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  getJobApplicationTotal(
    @GetUser() user: Auth,
    @Query() query: QueryJobPostDto,
  ) {
    return this.jobPostService.findExpiringJobs(query, user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.jobPostService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Body() body: UpdateJobPostDto,
    @GetUser() user: Auth,
    @Param('id') id: string,
  ) {
    return this.jobPostService.update(id, user, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.jobPostService.remove(id, user);
  }
}
