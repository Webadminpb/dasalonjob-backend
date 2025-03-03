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
  Query,
} from '@nestjs/common';
import { PartnerVenueService } from './partner-venue.service';
import { CreatePartnerVenueDto } from './dto/create-partner-venue.dto';
import { UpdatePartnerVenueDto } from './dto/update-partner-venue.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import { QueryPartnerVenueDto } from './dto/query-partner-venue.dto';

@ApiTags('partner-venue')
@Controller('partner-venue')
export class PartnerVenueController {
  constructor(private readonly partnerVenueService: PartnerVenueService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreatePartnerVenueDto) {
    return this.partnerVenueService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findAll(@GetUser() user: Auth, @Query() query: QueryPartnerVenueDto) {
    console.log('all');
    return this.partnerVenueService.findAll(user, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findOne(@Param('id') id: string) {
    return this.partnerVenueService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Param('id') id: string,
    @Body() body: UpdatePartnerVenueDto,
    @GetUser() user: Auth,
  ) {
    return this.partnerVenueService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.partnerVenueService.remove(id, user);
  }
}
