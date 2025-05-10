import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { AgencyContactDetailService } from './agency-contact-details.service';
import { CreateAgencyContactDetailDto } from './dto/agency-contact-details.dto';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { Auth } from '@prisma/client';
import { UpdateContactdetailDto } from '../contact-details/dto/update-contact-detail.dto';

@Controller('agency-contact-details')
export class AgencyContactDetailController {
  constructor(
    private readonly agencyContactDetailService: AgencyContactDetailService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated()
  createAgencyContactDetails(
    @Body() body: CreateAgencyContactDetailDto,
    @GetUser() user: Auth,
  ) {
    return this.agencyContactDetailService.createAgencyContactDetails(
      body,
      user,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAgencyContactDetail(@GetUser() user: Auth) {
    return this.agencyContactDetailService.getAgencyContactDetails(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  updateAgencyContactDetail(
    @Body() body: UpdateContactdetailDto,
    @GetUser() user: Auth,
  ) {
    return this.agencyContactDetailService.updateAgencyContactDetails(
      body,
      user,
    );
  }
}
