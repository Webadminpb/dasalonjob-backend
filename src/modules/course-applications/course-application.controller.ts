import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { CourseApplicationService } from './course-application.service';
import { CreateCourseApplicationDto } from './dto/create-course-application.dto';
import { QueryCourseApplicationDto } from './dto/query-course-application.dto';

@Controller('course-application')
export class CourseApplicationController {
  constructor(
    private readonly courseApplicationService: CourseApplicationService,
  ) {}

  @Post('partner')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER')
  create(@Body() body: CreateCourseApplicationDto, @GetUser() user: Auth) {
    return this.courseApplicationService.create(body, user);
  }

  @Get('partner')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findAllForPartner(
    @Query() query: QueryCourseApplicationDto,
    @GetUser() user: Auth,
  ) {
    return this.courseApplicationService.findAllCourseApplicationsForPartner(
      query,
      user,
    );
  }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN')
  findAllForAdmin(
    @Query() query: QueryCourseApplicationDto,
    @GetUser() user: Auth,
  ) {
    return this.courseApplicationService.findAllCourseApplicationsForAdmin(
      query,
    );
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findAllForApplicant(
    @Query() query: QueryCourseApplicationDto,
    @GetUser() user: Auth,
  ) {
    return this.courseApplicationService.findAllCourseApplicationsForApplicant(
      query,
      user,
    );
  }
}
