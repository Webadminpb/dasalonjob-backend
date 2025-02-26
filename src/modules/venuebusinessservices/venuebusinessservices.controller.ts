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
import { VenueMainBusinessServicesService } from './venuebusinessservices.service';
import { CreateVenueMainBusinessServicesDto } from './dto/create-venuebusinessservice.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { UpdateVenueMainBusinessServicesDto } from './dto/update-venuebusinessservice.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('partner')
@Controller('venue-main-business-services')
export class VenueMainBusinessServicesController {
  constructor(
    private readonly venueMainBusinessServicesService: VenueMainBusinessServicesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(
    @Body() body: CreateVenueMainBusinessServicesDto,
    @GetUser() user: Auth,
  ) {
    return this.venueMainBusinessServicesService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyVenueMainBusinessServices(@GetUser() user: Auth) {
    return this.venueMainBusinessServicesService.findMyVenueMainBusinessServices(
      user,
    );
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Body() body: UpdateVenueMainBusinessServicesDto,
    @GetUser() user: Auth,
  ) {
    return this.venueMainBusinessServicesService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth) {
    return this.venueMainBusinessServicesService.remove(user);
  }
}
