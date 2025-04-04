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
import { VenueMainBusinessDaysService } from './venuebusinessdays.service';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { CreateVenueMainBusinessDaysDto } from './dto/create-venuebusinessday.dto';
import { UpdateVenueMainBusinessDaysDto } from './dto/update-venuebusinessday.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('partner')
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

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyVenueMainBusinessDays(@GetUser() user: Auth) {
    console.log('all api running');
    return this.venueMainBusinessDaysService.findAllVenueMainBusinessDays(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findVenueMainBusinessDays(@GetUser() user: Auth, @Param('id') id: string) {
    return this.venueMainBusinessDaysService.findMyVenueMainBusinessDays(
      id,
      user,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Body() body: UpdateVenueMainBusinessDaysDto,
    @GetUser() user: Auth,
    @Param('id') id: string,
  ) {
    return this.venueMainBusinessDaysService.update(id, user, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.venueMainBusinessDaysService.remove(id, user);
  }
}
