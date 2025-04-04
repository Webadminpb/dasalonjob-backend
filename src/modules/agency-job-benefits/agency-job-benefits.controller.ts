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
import { AgencyJobBenefitsService } from './agency-job-benefits.service';
import { CreateAgencyJobBenefitsDto } from './dto/create-agency-job-benefit.dto';
import { UpdateAgencyJobBenefitsDto } from './dto/update-agency-job-benefit.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('agency')
@Controller('agency-job-benefits')
export class AgencyJobBenefitsController {
  constructor(
    private readonly agencyJobBenefitsService: AgencyJobBenefitsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  create(@Body() body: CreateAgencyJobBenefitsDto, @GetUser() user: Auth) {
    return this.agencyJobBenefitsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  findMyAgencyJobBenefits(@GetUser() user: Auth) {
    return this.agencyJobBenefitsService.findMyAgencyJobBenefits(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  update(@Body() body: UpdateAgencyJobBenefitsDto, @GetUser() user: Auth) {
    return this.agencyJobBenefitsService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.agencyJobBenefitsService.remove(user);
  }
}
