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
import { UpdateCourseApplicationDto } from './dto/update-course-application.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';
import { QueryCourseApplicationDto } from './dto/query-course-application.dto';

@Controller('course-application')
export class CourseApplicationController {
  constructor(
    private readonly courseApplicationService: CourseApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateCourseApplicationDto, @GetUser() user: Auth) {
    return this.courseApplicationService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findAll(@Query() query: QueryCourseApplicationDto, @GetUser() user: Auth) {
    return this.courseApplicationService.findAll(query, user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findOne(@Param('id') id: string) {
    return this.courseApplicationService.findOne(+id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Param('id') id: string,
    @Body() updateCourseApplicationDto: UpdateCourseApplicationDto,
  ) {
    return this.courseApplicationService.update(
      +id,
      updateCourseApplicationDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@Param('id') id: string) {
    return this.courseApplicationService.remove(+id);
  }
}
