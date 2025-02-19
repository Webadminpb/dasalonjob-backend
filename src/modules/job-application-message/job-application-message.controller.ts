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
  create(@Body() body: CreateJobApplicationMessageDto, @GetUser() user: Auth) {
    return this.jobApplicationMessageService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'PARTNER')
  findAll(@GetUser() user: Auth) {
    return this.jobApplicationMessageService.findAll(user);
  }

  @Get('/job-application/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'PARTNER')
  findJobApplicationMessage(@GetUser() user: Auth, @Param('id') id: string) {
    return this.jobApplicationMessageService.findJobApplicationMessage(
      id,
      user,
    );
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findOne(@Param('id') id: string) {
    return this.jobApplicationMessageService.findOne(id);
  }

  @Put('/partner/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Param('id') id: string,
    @Body() body: UpdateJobApplicationMessageDto,
    @GetUser() user: Auth,
  ) {
    return this.jobApplicationMessageService.update(id, body, user);
  }

  @Delete('/partner/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.jobApplicationMessageService.remove(id, user);
  }
}
