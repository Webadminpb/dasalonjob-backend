import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';

import { Auth } from '@prisma/client';
import { VenueMainBusinessDaysService } from './venuebusinessdays.service';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { CreateVenueMainBusinessDaysDto } from './dto/create-venuebusinessday.dto';
import { UpdateVenueMainBusinessDaysDto } from './dto/update-venuebusinessday.dto';

@Controller('venue-main-business-days')
export class VenueMainBusinessDaysController {
  constructor(
    private readonly venueMainBusinessDaysService: VenueMainBusinessDaysService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateVenueMainBusinessDaysDto, @GetUser() user: Auth) {
    return this.venueMainBusinessDaysService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyVenueMainBusinessDays(@GetUser() user: Auth) {
    return this.venueMainBusinessDaysService.findMyVenueMainBusinessDays(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(@Body() body: UpdateVenueMainBusinessDaysDto, @GetUser() user: Auth) {
    return this.venueMainBusinessDaysService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth) {
    return this.venueMainBusinessDaysService.remove(user);
  }
}
