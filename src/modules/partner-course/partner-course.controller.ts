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

  @Get('partner')
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: QueryPartnerCourseDto, @GetUser() user: Auth) {
    return this.partnerCourseService.findAll(query, user);
  }

  @Get('partner/:id')
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.OK)
  findOneForPartner(@Param('id') id: string, @GetUser() user: Auth) {
    return this.partnerCourseService.findOneForPartner(id, user);
  }

  @Get('user/:id')
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.OK)
  findOneForApplicant(@Param('id') id: string) {
    return this.partnerCourseService.findOneForApplicant(id);
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

  @Get('admin/total/course-status')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  getJobStatusTotal() {
    return this.partnerCourseService.getCourseStatusTotal();
  }
}
