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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('partner')
@ApiBearerAuth()
@Controller('venue-details')
export class VenueDetailsController {
  constructor(private readonly venueDetailsService: VenueDetailsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  @ApiOperation({ summary: 'Create venue details' })
  @ApiBody({ type: CreateVenueDetailsDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Venue details created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  create(@Body() body: CreateVenueDetailsDto, @GetUser() user: Auth) {
    return this.venueDetailsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  @ApiOperation({ summary: 'Get venue details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Venue details retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  findMyVenueDetails(@GetUser() user: Auth) {
    return this.venueDetailsService.findMyVenueDetails(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  @ApiOperation({ summary: 'Update venue details' })
  @ApiBody({ type: UpdateVenueDetailsDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Venue details updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  update(@Body() body: UpdateVenueDetailsDto, @GetUser() user: Auth) {
    return this.venueDetailsService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  @ApiOperation({ summary: 'Delete venue details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Venue details deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  remove(@GetUser() user: Auth) {
    return this.venueDetailsService.remove(user);
  }
}
