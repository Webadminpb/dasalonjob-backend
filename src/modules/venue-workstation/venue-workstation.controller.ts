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
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { CreateVenueWorkStationDto } from './dto/create-venue-workstation.dto';
import { UpdateVenueWorkStationDto } from './dto/update-venue-workstation.dto';
import { VenueWorkStationService } from './venue-workstation.service';

@ApiTags('venue-work-station')
@Controller('venue-work-station')
export class VenueWorkStationController {
  constructor(
    private readonly venueWorkStationService: VenueWorkStationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateVenueWorkStationDto, @GetUser() user: Auth) {
    return this.venueWorkStationService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findAll(@GetUser() user: Auth) {
    return this.venueWorkStationService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findOne(@Param('id') id: string) {
    return this.venueWorkStationService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Param('id') id: string,
    @Body() body: UpdateVenueWorkStationDto,
    @GetUser() user: Auth,
  ) {
    return this.venueWorkStationService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.venueWorkStationService.remove(id, user);
  }
}
