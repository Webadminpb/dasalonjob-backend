import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { AgencyDetailsService } from './agency-details.service';
import { CreateAgencyDetailsDto } from './dto/create-agency-details.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { UpdateAgencyDetailsDto } from './dto/update-agency-details.dto';

@Controller('agency-details')
export class AgencyDetailsController {
  constructor(private readonly agencyDetailsService: AgencyDetailsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  create(@Body() body: CreateAgencyDetailsDto, @GetUser() user: Auth) {
    return this.agencyDetailsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  findMyAgencyDetails(@GetUser() user: Auth) {
    return this.agencyDetailsService.findMyAgencyDetails(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  update(@Body() body: UpdateAgencyDetailsDto, @GetUser() user: Auth) {
    return this.agencyDetailsService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  remove(@GetUser() user: Auth) {
    return this.agencyDetailsService.remove(user);
  }
}
