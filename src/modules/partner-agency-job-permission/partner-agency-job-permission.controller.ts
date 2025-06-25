import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import { PartnerAgencyPermissionService } from './partner-agency-job-permission.service';
import { CreatePartnerAgencyPermissionDto } from './dto/create-partner-agency-job-permission.dto';
import { QueryPartnerAgencyPermissionDto } from './dto/query-partner-agency-job-permission.dto';
import { UpdatePartnerAgencyPermissionDto } from './dto/update-partner-agency-job-permission.dto';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';

@ApiTags('partner-agency-permissions')
@Controller('partner-agency-permissions')
export class PartnerAgencyPermissionController {
  constructor(
    private readonly permissionService: PartnerAgencyPermissionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN', 'AGENCY')
  create(
    @Body() body: CreatePartnerAgencyPermissionDto,
    @GetUser() user: Auth,
  ) {
    return this.permissionService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: QueryPartnerAgencyPermissionDto) {
    return this.permissionService.findAll(query);
  }

  @Get('pending')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  getPending(@Query('role') role: 'PARTNER' | 'AGENCY', @GetUser() user: Auth) {
    return this.permissionService.getPendingRequests(role, user.id);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  approve(@Param('id') id: string, @GetUser() user: Auth) {
    return this.permissionService.approvePermission(id, user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN', 'AGENCY', 'PARTNER')
  update(
    @Param('id') id: string,
    @Body() body: UpdatePartnerAgencyPermissionDto,
  ) {
    return this.permissionService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN', 'AGENCY')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }

  @Get('check-permission/:partnerId/:agencyId')
  @HttpCode(HttpStatus.OK)
  checkPermission(
    @Param('partnerId') partnerId: string,
    @Param('agencyId') agencyId: string,
  ) {
    return this.permissionService.checkPermission(partnerId, agencyId);
  }
}
