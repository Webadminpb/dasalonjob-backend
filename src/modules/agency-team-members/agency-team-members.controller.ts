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
  Query,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAgencyTeamMemberDto } from './dto/create-agency-team-member.dto';
import { UpdateAgencyTeamMemberDto } from './dto/update-agency-team-member.dto';
import { AgencyTeamService } from './agency-team-members.service';
import { QueryAgencyTeamMembersDto } from './dto/query-agency-team-member.dto';

@ApiTags('Agency Team Management')
@Controller('agency/team')
export class AgencyTeamController {
  constructor(private readonly agencyTeamService: AgencyTeamService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  addTeamMember(
    @Body() body: CreateAgencyTeamMemberDto,
    @GetUser() user: Auth,
  ) {
    return this.agencyTeamService.addTeamMember(user, body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  getTeamMembers(
    @Query() query: QueryAgencyTeamMembersDto,
    @GetUser() user: Auth,
  ) {
    return this.agencyTeamService.getTeamMembers(user, query);
  }

  @Get(':memberId')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  getTeamMember(@Param('memberId') memberId: string, @GetUser() user: Auth) {
    return this.agencyTeamService.getTeamMember(user, memberId);
  }

  @Put(':memberId')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  updateTeamMember(
    @Param('memberId') memberId: string,
    @Body() body: UpdateAgencyTeamMemberDto,
    @GetUser() user: Auth,
  ) {
    return this.agencyTeamService.updateTeamMember(user, memberId, body);
  }

  @Delete(':memberId')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  removeTeamMember(@Param('memberId') memberId: string, @GetUser() user: Auth) {
    return this.agencyTeamService.removeTeamMember(user, memberId);
  }
}
