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
import { Auth } from '@prisma/client';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { AgencyJobBasicInfoService } from './agency-job-basic-info.service';
import { CreateAgencyJobBasicInfoDto } from './dto/create-agency-job-basic-info.dto';
import { UpdateAgencyJobBasicInfoDto } from './dto/update-agency-job-basic-info.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('agency')
@Controller('agency-job-basic-info')
export class AgencyJobBasicInfoController {
  constructor(
    private readonly agencyJobBasicInfoService: AgencyJobBasicInfoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  create(@Body() body: CreateAgencyJobBasicInfoDto, @GetUser() user: Auth) {
    return this.agencyJobBasicInfoService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  findMyAgencyJobBasicInfo(@GetUser() user: Auth) {
    return this.agencyJobBasicInfoService.findMyAgencyJobBasicInfo(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  update(@Body() body: UpdateAgencyJobBasicInfoDto, @GetUser() user: Auth) {
    return this.agencyJobBasicInfoService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.agencyJobBasicInfoService.remove(user);
  }
}
