import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { PartnerSocialLinksService } from './partner-social-links.service';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { Auth } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreatePartnerSocialLinksDto } from './dto/create-partner-social-link.dto';
import { UpdatePartnerSocialLinksDto } from './dto/update-partner-social-link.dto';

@ApiTags('partner-social-links')
@Controller('partner-social-links')
export class PartnerSocialLinksController {
  constructor(
    private readonly partnerSocialLinksService: PartnerSocialLinksService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreatePartnerSocialLinksDto, @GetUser() user: Auth) {
    return this.partnerSocialLinksService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMySocialLinks(@GetUser() user: Auth) {
    return this.partnerSocialLinksService.findMySocialLinks(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(@Body() body: UpdatePartnerSocialLinksDto, @GetUser() user: Auth) {
    return this.partnerSocialLinksService.update(body, user);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth) {
    return this.partnerSocialLinksService.remove(user);
  }
}
