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
import { AgencyJobDescriptionService } from './agency-job-description.service';
import { CreateAgencyJobDescriptionDto } from './dto/create-agency-job-description.dto';
import { UpdateAgencyJobDescriptionDto } from './dto/update-agency-job-description.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('agency')
@Controller('agency-job-description')
export class AgencyJobDescriptionController {
  constructor(
    private readonly agencyJobDescriptionService: AgencyJobDescriptionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  create(@Body() body: CreateAgencyJobDescriptionDto, @GetUser() user: Auth) {
    return this.agencyJobDescriptionService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  findMyAgencyJobDescriptions(@GetUser() user: Auth) {
    return this.agencyJobDescriptionService.findMyAgencyJobDescriptions(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  update(@Body() body: UpdateAgencyJobDescriptionDto, @GetUser() user: Auth) {
    return this.agencyJobDescriptionService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  remove(@GetUser() user: Auth) {
    return this.agencyJobDescriptionService.remove(user);
  }
}
