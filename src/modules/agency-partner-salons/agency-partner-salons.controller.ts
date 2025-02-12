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
import { AgencyPartnerSalonsService } from './agency-partner-salons.service';
import { CreateAgencyPartnerSalonDto } from './dto/create-agency-partner-salon.dto';
import { UpdateAgencyPartnerSalonDto } from './dto/update-agency-partner-salon.dto';
import { AllowAuthenticated } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';

@Controller('agency-partner-salons')
export class AgencyPartnerSalonsController {
  constructor(
    private readonly agencyPartnerSalonsService: AgencyPartnerSalonsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  create(@Body() body: CreateAgencyPartnerSalonDto, user: Auth) {
    return this.agencyPartnerSalonsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  findAll() {
    return this.agencyPartnerSalonsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  findOne(@Param('id') id: string) {
    return this.agencyPartnerSalonsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  update(
    @Param('id') id: string,
    @Body() updateAgencyPartnerSalonDto: UpdateAgencyPartnerSalonDto,
  ) {
    return this.agencyPartnerSalonsService.update(
      id,
      updateAgencyPartnerSalonDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  remove(@Param('id') id: string) {
    return this.agencyPartnerSalonsService.remove(id);
  }
}
