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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { CreateJobApplicationMessageDto } from './dto/create-job-application-message.dto';
import { UpdateJobApplicationMessageDto } from './dto/update-job-application-message.dto';
import { JobApplicationMessageService } from './job-application-message.service';

@ApiTags('job-application-message')
@Controller('job-application-message')
export class JobApplicationMessageController {
  constructor(
    private readonly jobApplicationMessageService: JobApplicationMessageService,
  ) {}

  @Post('/partner')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  createMessageFromPartnerSide(
    @Body() body: CreateJobApplicationMessageDto,
    @GetUser() user: Auth,
  ) {
    return this.jobApplicationMessageService.createMessageFromPartnerSide(
      body,
      user,
    );
  }

  @Post('/applicant')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER')
  createMessageFromApplicantSide(
    @Body() body: CreateJobApplicationMessageDto,
    @GetUser() user: Auth,
  ) {
    return this.jobApplicationMessageService.createMessageFromPartnerSide(
      body,
      user,
    );
  }

  @Get('/partner/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findOnePartnerMessage(@Param('id') id: string) {
    return this.jobApplicationMessageService.findOnePartnerMessage(id);
  }

  @Get('/applicant/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findOneApplicantMessage(@Param('id') id: string) {
    return this.jobApplicationMessageService.findOneApplicantMessage(id);
  }

  @Put('/partner/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  updatePartnerMessage(
    @Param('id') id: string,
    @Body() body: UpdateJobApplicationMessageDto,
    @GetUser() user: Auth,
  ) {
    return this.jobApplicationMessageService.updatePartnerMessage(
      id,
      body,
      user,
    );
  }

  @Put('/applicant/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  updateApplicantMessage(
    @Param('id') id: string,
    @Body() body: UpdateJobApplicationMessageDto,
    @GetUser() user: Auth,
  ) {
    return this.jobApplicationMessageService.updateApplicantMessage(
      id,
      body,
      user,
    );
  }

  @Delete('/partner/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  removePartnerMessage(@Param('id') id: string, @GetUser() user: Auth) {
    return this.jobApplicationMessageService.removePartnerMessage(id, user);
  }

  @Delete('/applicant/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  removeApplicant(@Param('id') id: string, @GetUser() user: Auth) {
    return this.jobApplicationMessageService.removeApplicantMessage(id, user);
  }
}
