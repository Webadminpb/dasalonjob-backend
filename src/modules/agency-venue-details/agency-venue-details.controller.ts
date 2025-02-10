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
import { AgencyVenueDetailsService } from './agency-venue-details.service';
import { CreateAgencyVenueDetailsDto } from './dto/create-agency-venue-detail.dto';
import { UpdateAgencyVenueDetailsDto } from './dto/update-agency-venue-detail.dto';

@Controller('agency-venue-details')
export class AgencyVenueDetailsController {
  constructor(
    private readonly agencyVenueDetailsService: AgencyVenueDetailsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  create(@Body() body: CreateAgencyVenueDetailsDto, @GetUser() user: Auth) {
    return this.agencyVenueDetailsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  findMyAgencyVenueDetails(@GetUser() user: Auth) {
    return this.agencyVenueDetailsService.findMyAgencyVenueDetails(user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  update(
    @Body() body: UpdateAgencyVenueDetailsDto,
    @Param('id') id: string,
    @GetUser() user: Auth,
  ) {
    return this.agencyVenueDetailsService.update(user, id, body);
  }

  @Delete('id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.agencyVenueDetailsService.remove(user, id);
  }
}
