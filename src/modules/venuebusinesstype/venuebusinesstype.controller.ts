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
import { VenueMainBusinessTypeService } from './venuebusinesstype.service';
import { CreateVenueMainBusinessTypeDto } from './dto/create-venuebusinesstype.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { UpdateVenuebusinesstypeDto } from './dto/update-venuebusinesstype.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('partner')
@ApiBearerAuth()
@Controller('venue-main-business-type')
export class VenueMainBusinessTypeController {
  constructor(
    private readonly venueMainBusinessTypeService: VenueMainBusinessTypeService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  @ApiOperation({ summary: 'Create venue main business type' })
  @ApiBody({ type: CreateVenueMainBusinessTypeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Venue main business type created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  create(@Body() body: CreateVenueMainBusinessTypeDto, @GetUser() user: Auth) {
    return this.venueMainBusinessTypeService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  @ApiOperation({ summary: 'Get venue main business type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Venue main business type retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  findMyVenueMainBusinessType(@GetUser() user: Auth) {
    return this.venueMainBusinessTypeService.findMyVenueMainBusinessType(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  @ApiOperation({ summary: 'Update venue main business type' })
  @ApiBody({ type: UpdateVenuebusinesstypeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Venue main business type updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  update(@Body() body: UpdateVenuebusinesstypeDto, @GetUser() user: Auth) {
    return this.venueMainBusinessTypeService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  @ApiOperation({ summary: 'Delete venue main business type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Venue main business type deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  remove(@GetUser() user: Auth) {
    return this.venueMainBusinessTypeService.remove(user);
  }
}
