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
import { VenueDetailsService } from './venuedetails.service';
import { CreateVenueDetailsDto } from './dto/create-venuedetail.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { UpdateVenueDetailsDto } from './dto/update-venuedetail.dto';

@Controller('venue-details')
export class VenueDetailsController {
  constructor(private readonly venueDetailsService: VenueDetailsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateVenueDetailsDto, @GetUser() user: Auth) {
    return this.venueDetailsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyVenueDetails(@GetUser() user: Auth) {
    return this.venueDetailsService.findMyVenueDetails(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(@Body() body: UpdateVenueDetailsDto, @GetUser() user: Auth) {
    return this.venueDetailsService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth) {
    return this.venueDetailsService.remove(user);
  }
}
