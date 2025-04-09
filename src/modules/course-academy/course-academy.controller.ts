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
import { CourseAcademyService } from './course-academy.service';
import { CreateCourseAcademyDto } from './dto/create-course-academy.dto';
import { UpdateCourseAcademyDto } from './dto/update-course-academy.dto';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@prisma/client';

@ApiTags('course-academy')
@Controller('course-academy')
export class CourseAcademyController {
  constructor(private readonly courseAcademyService: CourseAcademyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  create(@Body() body: CreateCourseAcademyDto, @GetUser() user: Auth) {
    return this.courseAcademyService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  findAll(@GetUser() user: Auth) {
    return this.courseAcademyService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findOne(@Param('id') id: string, @GetUser() user: Auth) {
    return this.courseAcademyService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCourseAcademyDto,
    @GetUser() user: Auth,
  ) {
    return this.courseAcademyService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.courseAcademyService.remove(id, user);
  }
}
