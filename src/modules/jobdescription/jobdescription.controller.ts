import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
  Param,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { JobDescriptionService } from './jobdescription.service';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { CreateJobDescriptionDto } from './dto/create-jobdescription.dto';
import { UpdateJobDescriptionDto } from './dto/update-jobdescription.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('partner')
@Controller('job-description')
export class JobDescriptionController {
  constructor(private readonly jobDescriptionService: JobDescriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateJobDescriptionDto, @GetUser() user: Auth) {
    console.log('body ', body);
    return this.jobDescriptionService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyJobDescription(@GetUser() user: Auth) {
    return this.jobDescriptionService.findMyJobDescription(user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Body() body: UpdateJobDescriptionDto,
    @GetUser() user: Auth,
    @Param('id') id: string,
  ) {
    return this.jobDescriptionService.update(id, user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.jobDescriptionService.remove(id, user);
  }
}
