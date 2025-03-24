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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCourseTypeAndLocationDto,
  ) {
    return this.courseTypeAndLocationService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@Param('id') id: string) {
    return this.courseTypeAndLocationService.remove(id);
  }
}
