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
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { JobBasicInfoService } from './jobbasicinfo.service';
import { CreateJobBasicInfoDto } from './dto/create-jobbasicinfo.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { UpdateJobBasicInfoDto } from './dto/update-jobbasicinfo.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('partner')
@Controller('job-basic-info')
export class JobBasicInfoController {
  constructor(private readonly jobBasicInfoService: JobBasicInfoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateJobBasicInfoDto, @GetUser() user: Auth) {
    return this.jobBasicInfoService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyJobBasicInfo(@GetUser() user: Auth) {
    return this.jobBasicInfoService.findMyJobBasicInfo(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(@Body() body: UpdateJobBasicInfoDto, @GetUser() user: Auth) {
    return this.jobBasicInfoService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth) {
    return this.jobBasicInfoService.remove(user);
  }
}
