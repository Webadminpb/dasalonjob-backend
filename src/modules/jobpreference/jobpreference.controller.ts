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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  update(
    @Param('id') id: string,
    @Body() body: UpdateJobpreferenceDto,
    @GetUser() user: Auth,
  ) {
    return this.jobpreferenceService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.jobpreferenceService.remove(id, user);
  }
}
