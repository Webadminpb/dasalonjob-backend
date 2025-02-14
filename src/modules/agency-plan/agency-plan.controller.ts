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
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { AgencyPlanService } from './agency-plan.service';
import { CreateAgencyPlanDto } from './dto/create-agency-plan.dto';
import { UpdateAgencyPlanDto } from './dto/update-agency-plan.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('agency')
@Controller('agency-plans')
export class AgencyPlanController {
  constructor(private readonly agencyPlanService: AgencyPlanService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  create(@Body() body: CreateAgencyPlanDto, @GetUser() user: Auth) {
    return this.agencyPlanService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  findMyAgencyPlans(@GetUser() user: Auth) {
    return this.agencyPlanService.findMyAgencyPlans(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  update(@Body() body: UpdateAgencyPlanDto, @GetUser() user: Auth) {
    return this.agencyPlanService.update(body, user);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  remove(@GetUser() user: Auth) {
    return this.agencyPlanService.remove(user);
  }
}
