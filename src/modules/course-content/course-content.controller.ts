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
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreateCourseContentDto } from './dto/create-course-content.dto';
import { UpdateCourseContentDto } from './dto/update-course-content.dto';
import { Auth } from '@prisma/client';
import { CourseContentService } from './course-content.service';

@ApiTags('course-content')
@Controller('course-content')
export class CourseContentController {
  constructor(private readonly courseContentService: CourseContentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('SUPER_ADMIN')
  create(@Body() body: CreateCourseContentDto) {
    return this.courseContentService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findAll(@GetUser() user: Auth) {
    return this.courseContentService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findOne(@Param('id') id: string) {
    return this.courseContentService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('SUPER_ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCourseContentDto,
    @GetUser() user: Auth,
  ) {
    return this.courseContentService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('SUPER_ADMIN')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.courseContentService.remove(id, user);
  }
}
