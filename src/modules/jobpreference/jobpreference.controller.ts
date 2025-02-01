import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { JobpreferenceService } from './jobpreference.service';
import { CreateJobpreferenceDto } from './dto/create-jobpreference.dto';
import { UpdateJobpreferenceDto } from './dto/update-jobpreference.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';

@Controller('jobpreference')
export class JobpreferenceController {
  constructor(private readonly jobpreferenceService: JobpreferenceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER')
  create(@Body() body: CreateJobpreferenceDto, @GetUser() user: Auth) {
    return this.jobpreferenceService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findMyJobPreference(@GetUser() user: Auth) {
    return this.jobpreferenceService.findMyJobPreference(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  update(@Body() body: UpdateJobpreferenceDto, @GetUser() user: Auth) {
    return this.jobpreferenceService.update(body, user);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  remove(@GetUser() user: Auth) {
    return this.jobpreferenceService.remove(user);
  }
}
