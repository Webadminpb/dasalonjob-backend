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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { QueryJobApplicationDto } from './dto/query-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { JobApplicationService } from './job-applications.service';

@ApiTags('Job Applications')
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
  @AllowAuthenticated('PARTNER')
  findAll(@Query() query: QueryJobApplicationDto) {
    return this.jobApplicationService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.jobApplicationService.findOne(id);
  }

  @Patch('/partner/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Param('id') id: string,
    @Body() body: UpdateJobApplicationDto,
    @GetUser() user: Auth,
  ) {
    return this.jobApplicationService.update(id, body, user);
  }

  @Delete('/partner/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.jobApplicationService.remove(id, user);
  }
}
