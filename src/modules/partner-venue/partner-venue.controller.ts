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
  Req,
} from '@nestjs/common';
import { PartnerVenueService } from './partner-venue.service';
import { CreatePartnerVenueDto } from './dto/create-partner-venue.dto';
import { UpdatePartnerVenueDto } from './dto/update-partner-venue.dto';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
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
  create(@Body() body: CreatePartnerVenueDto, @GetUser() user: Auth) {
    return this.partnerVenueService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findAll(@GetUser() user: Auth, @Query() query: QueryPartnerVenueDto) {
    return this.partnerVenueService.findAll(query, user);
  }

  @Get('/admin')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  findAllForAdmin(@GetUser() user: Auth, @Query() query: QueryPartnerVenueDto) {
    return this.partnerVenueService.findAllForAdmin(query);
  }

  @Get('job-application-total')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  getJobApplicationTotal(@GetUser() user: Auth, @Req() req: any) {
    return this.partnerVenueService.jobApplicationTotal(user);
  }

  @Get('total')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  getDashboardTotal(@GetUser() user: Auth) {
    return this.partnerVenueService.dashboardTotal(user);
  }

  @Get('admin/total')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  getAdminDashboardTotal() {
    return this.partnerVenueService.adminDashboardTotal();
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

  // @Get('/partner')
  // @HttpCode(HttpStatus.OK)
  // @AllowAuthenticated()
  // getVenuesData;
}
