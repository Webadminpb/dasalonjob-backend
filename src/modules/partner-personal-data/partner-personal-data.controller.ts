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
import { Auth } from '@prisma/client';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { CreatePartnerPersonalDataDto } from './dto/create-partner-personal-datum.dto';
import { UpdatePartnerPersonalDataDto } from './dto/update-partner-personal-datum.dto';
import { PartnerPersonalDataService } from './partner-personal-data.service';

@Controller('partner-personal-data')
export class PartnerPersonalDataController {
  constructor(
    private readonly partnerPersonalDataService: PartnerPersonalDataService,
  ) {}

  @Post()
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPartnerPersonalDataDto: CreatePartnerPersonalDataDto,
    @GetUser() user: Auth,
  ) {
    return this.partnerPersonalDataService.create(
      createPartnerPersonalDataDto,
      user,
    );
  }

  // @Get()
  // @AllowAuthenticated('PARTNER')
  // @HttpCode(HttpStatus.OK)
  // findAll(@GetUser() user: Auth) {
  //   return this.partnerPersonalDataService.findAll(user);
  // }

  @Get('me')
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.OK)
  findMy(@GetUser() user: Auth) {
    return this.partnerPersonalDataService.findMy(user);
  }

  @Get(':id')
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.partnerPersonalDataService.findOne(id);
  }

  @Put(':id')
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.CREATED)
  update(
    @Param('id') id: string,
    @Body() updatePartnerPersonalDataDto: UpdatePartnerPersonalDataDto,
    @GetUser() user: Auth,
  ) {
    return this.partnerPersonalDataService.update(
      id,
      updatePartnerPersonalDataDto,
      user,
    );
  }

  @Delete(':id')
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.CREATED)
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.partnerPersonalDataService.remove(id, user);
  }

  @Get('admin/:partnerId/business-details')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('SUPER_ADMIN', 'ADMIN')
  getBusinessDetailsByPartnerId(@Param('partnerId') partnerId: string) {
    return this.partnerPersonalDataService.getBusinessDetailsByPartnerId(
      partnerId,
    );
  }

  @Get('admin/:partnerId/profile')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('SUPER_ADMIN', 'ADMIN')
  getPartnerProfileByPartnerId(@Param('partnerId') partnerId: string) {
    return this.partnerPersonalDataService.getPartnerDetailsByPartnerId(
      partnerId,
    );
  }

  @Get('admin/:partnerId/venues')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('SUPER_ADMIN', 'ADMIN')
  getPartnerVenusByPartnerId(@Param('partnerId') partnerId: string) {
    return this.partnerPersonalDataService.getPartnerVenuesByPartnerId(
      partnerId,
    );
  }

  // @Get('admin/:partnerId/venues')
  // @HttpCode(HttpStatus.OK)
  // @AllowAuthenticated('SUPER_ADMIN', 'ADMIN')
  // getPartnerVenusByPartnerId(@Param('partnerId') partnerId: string) {
  //   return this.partnerPersonalDataService.getPartnerVenuesByPartnerId(
  //     partnerId,
  //   );
  // }
}
