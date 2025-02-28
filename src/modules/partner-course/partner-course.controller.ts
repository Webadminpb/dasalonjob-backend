import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
  Query,
} from '@nestjs/common';
import { PartnerCourseService } from './partner-course.service';
import { CreatePartnerCourseDto } from './dto/create-partner-course.dto';
import { UpdatePartnerCourseDto } from './dto/update-partner-course.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';
import { QueryPartnerVenueDto } from '../partner-venue/dto/query-partner-venue.dto';
import { QueryPartnerCourseDto } from './dto/query-partner-course.dto';

@Controller('partner-course')
export class PartnerCourseController {
  constructor(private readonly partnerCourseService: PartnerCourseService) {}

  @Post()
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPartnerCourseDto: CreatePartnerCourseDto,
    @GetUser() user: Auth,
  ) {
    return this.partnerCourseService.create(createPartnerCourseDto, user);
  }

  @Get()
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: QueryPartnerCourseDto, @GetUser() user: Auth) {
    return this.partnerCourseService.findAll(query, user);
  }

  @Get(':id')
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.partnerCourseService.findOne(id);
  }

  @Put(':id')
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.CREATED)
  update(
    @Param('id') id: string,
    @Body() updatePartnerCourseDto: UpdatePartnerCourseDto,
    @GetUser() user: Auth,
  ) {
    return this.partnerCourseService.update(id, updatePartnerCourseDto, user);
  }

  @Delete(':id')
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.CREATED)
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.partnerCourseService.remove(id);
  }
}
