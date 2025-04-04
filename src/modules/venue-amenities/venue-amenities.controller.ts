import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { VenueAmenitiesService } from './venue-amenities.service';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreateVenueAmenitiesDto } from './dto/create-venue-amenity.dto';
import { UpdateVenueAmenityDto } from './dto/update-venue-amenity.dto';
import { Auth } from '@prisma/client';

@ApiTags('venue-amenities')
@Controller('venue-amenities')
export class VenueAmenitiesController {
  constructor(private readonly venueAmenitiesService: VenueAmenitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateVenueAmenitiesDto, @GetUser() user: Auth) {
    return this.venueAmenitiesService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findAll(@GetUser() user: Auth) {
    return this.venueAmenitiesService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findOne(@Param('id') id: string) {
    return this.venueAmenitiesService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Param('id') id: string,
    @Body() body: UpdateVenueAmenityDto,
    @GetUser() user: Auth,
  ) {
    return this.venueAmenitiesService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.venueAmenitiesService.remove(id, user);
  }
}
