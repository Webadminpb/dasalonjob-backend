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
import { CreateJobBasicInfoDto } from './dto/create-jobbasicinfo.dto';
import { UpdateJobBasicInfoDto } from './dto/update-jobbasicinfo.dto';
import { JobBasicInfoService } from './jobbasicinfo.service';

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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Body() body: UpdateJobBasicInfoDto,
    @GetUser() user: Auth,
    @Param('id') id: string,
  ) {
    return this.jobBasicInfoService.update(id, user, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.jobBasicInfoService.remove(id, user);
  }
}
