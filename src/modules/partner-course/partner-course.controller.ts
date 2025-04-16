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
  Version,
} from '@nestjs/common';
import { PartnerCourseService } from './partner-course.service';
import { CreatePartnerCourseDto } from './dto/create-partner-course.dto';
import { UpdatePartnerCourseDto } from './dto/update-partner-course.dto';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { Auth } from '@prisma/client';
import { QueryPartnerCourseDto } from './dto/query-partner-course.dto';
import { CreateCourseStatusDto } from './dto/status-partner-course.dto';

@Controller('partner-course')
export class PartnerCourseController {
  constructor(private readonly partnerCourseService: PartnerCourseService) {}

  // Partner
  @Post()
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreatePartnerCourseDto, @GetUser() user: Auth) {
    return this.partnerCourseService.create(body, user);
  }

  // Partner
  @Get('users')
  @AllowAuthenticated('PARTNER', 'ADMIN', 'AGENCY')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: QueryPartnerCourseDto) {
    return this.partnerCourseService.findAll(query);
  }

  // Partner
  @Get('partner/:id')
  @AllowAuthenticated('PARTNER')
  @HttpCode(HttpStatus.OK)
  findOneForPartner(@Param('id') id: string, @GetUser() user: Auth) {
    return this.partnerCourseService.findOneForPartner(id, user);
  }

  // Partner, Admin, Applicant
  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  findOneForApplicant(@Param('id') id: string) {
    return this.partnerCourseService.findOneForApplicant(id);
  }

  // Partner
  @Put(':id')
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  update(
    @Param('id') id: string,
    @Body() body: UpdatePartnerCourseDto,
    @GetUser() user: Auth,
  ) {
    return this.partnerCourseService.update(id, body, user);
  }

  // Partner
  @Delete(':id')
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.partnerCourseService.remove(id);
  }

  // For Admin
  @Get('admin/total/course-status')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  getJobStatusTotal() {
    return this.partnerCourseService.getCourseStatusTotal();
  }

  @Patch('admin/status')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  updateJobPostStatusByIdForAdmin(
    @Body() body: CreateCourseStatusDto,
    @GetUser() user: Auth,
  ) {
    return this.partnerCourseService.updateCourseStatusByIdForAdmin(body, user);
  }

  @Get('admin/courses')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  getAllCoursesForAdmin(@Query() query: QueryPartnerCourseDto) {
    return this.partnerCourseService.findAllForAdmin(query);
  }

  @Get('courses')
  @HttpCode(HttpStatus.OK)
  getAllCoursesForApplicant(@Query() query: QueryPartnerCourseDto) {
    return this.partnerCourseService.findAllForAdmin(query);
  }
}
