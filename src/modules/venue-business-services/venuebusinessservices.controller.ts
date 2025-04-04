import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
  Param,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { VenueMainBusinessServicesService } from './venuebusinessservices.service';
import { CreateVenueMainBusinessServicesDto } from './dto/create-venuebusinessservice.dto';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
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

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findVenueMainBusinessServices(@GetUser() user: Auth) {
    return this.venueMainBusinessServicesService.findAllVenueMainBusinessServices(
      user,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyVenueMainBusinessServices(@Param('id') id: string) {
    return this.venueMainBusinessServicesService.findVenueMainBusinessServices(
      id,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Body() body: UpdateVenueMainBusinessServicesDto,
    @GetUser() user: Auth,
    @Param('id') id: string,
  ) {
    return this.venueMainBusinessServicesService.update(id, user, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.venueMainBusinessServicesService.remove(id, user);
  }
}
