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
import { AgencyPersonalDetailsService } from './agency-personal-details.service';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreateAgencyPersonalDetailsDto } from './dto/create-agency-personal-detail.dto';
import { UpdateAgencyPersonalDetailsDto } from './dto/update-agency-personal-detail.dto';

@ApiTags('agency-personal-details')
@Controller('agency-personal-details')
export class AgencyPersonalDetailsController {
  constructor(
    private readonly agencyPersonalDetailsService: AgencyPersonalDetailsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  create(@Body() body: CreateAgencyPersonalDetailsDto, @GetUser() user: Auth) {
    return this.agencyPersonalDetailsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  findMyDetails(@GetUser() user: Auth) {
    return this.agencyPersonalDetailsService.findMyDetails(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findAgencyDetailsById(@Param('id') id: string) {
    return this.agencyPersonalDetailsService.findAgencyDetailsById(id);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  update(@Body() body: UpdateAgencyPersonalDetailsDto, @GetUser() user: Auth) {
    return this.agencyPersonalDetailsService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  remove(@GetUser() user: Auth) {
    return this.agencyPersonalDetailsService.remove(user);
  }
}
