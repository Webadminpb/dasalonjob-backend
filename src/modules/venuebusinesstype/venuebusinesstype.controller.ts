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
import { VenueMainBusinessTypeService } from './venuebusinesstype.service';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { CreateVenueMainBusinessTypeDto } from './dto/create-venuebusinesstype.dto';
import { UpdateVenuebusinesstypeDto } from './dto/update-venuebusinesstype.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('partner')
@Controller('venue-main-business-type')
export class VenueMainBusinessTypeController {
  constructor(
    private readonly venueMainBusinessTypeService: VenueMainBusinessTypeService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateVenueMainBusinessTypeDto, @GetUser() user: Auth) {
    return this.venueMainBusinessTypeService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyVenueMainBusinessType(@GetUser() user: Auth) {
    return this.venueMainBusinessTypeService.findMyVenueMainBusinessType(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(@Body() body: UpdateVenuebusinesstypeDto, @GetUser() user: Auth) {
    return this.venueMainBusinessTypeService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth) {
    return this.venueMainBusinessTypeService.remove(user);
  }
}
