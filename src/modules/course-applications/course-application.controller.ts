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
  Query,
} from '@nestjs/common';
import { CourseApplicationService } from './course-application.service';
import { CreateCourseApplicationDto } from './dto/create-course-application.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';
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
  @AllowAuthenticated('PARTNER')
  findAllForAdmin(
    @Query() query: QueryCourseApplicationDto,
    @GetUser() user: Auth,
  ) {
    return this.courseApplicationService.findAllCourseApplicationsForPartner(
      query,
      user,
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
