import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CourseTypeAndLocationService } from './course-type-and-location.service';
import { CreateCourseTypeAndLocationDto } from './dto/create-course-type-and-location.dto';
import { UpdateCourseTypeAndLocationDto } from './dto/update-course-type-and-location.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@prisma/client';

@ApiTags('course-type-and-location')
@Controller('course-type-and-location')
export class CourseTypeAndLocationController {
  constructor(
    private readonly courseTypeAndLocationService: CourseTypeAndLocationService,
  ) {}

  // For Admin Partner
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  create(@Body() body: CreateCourseTypeAndLocationDto, @GetUser() user: Auth) {
    return this.courseTypeAndLocationService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findAll() {
    return this.courseTypeAndLocationService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findOne(@Param('id') id: string) {
    return this.courseTypeAndLocationService.findOne(id);
  }

  // For Admin Partner
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCourseTypeAndLocationDto,
  ) {
    return this.courseTypeAndLocationService.update(id, body);
  }

  // For Admin Partner
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.courseTypeAndLocationService.remove(id);
  }
}
