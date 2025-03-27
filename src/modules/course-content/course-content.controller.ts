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

  // For Admin Partner
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  create(@Body() body: CreateCourseContentDto, @GetUser() user: Auth) {
    return this.courseContentService.create(body, user);
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

  // For Admin Partner
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCourseContentDto,
    @GetUser() user: Auth,
  ) {
    return this.courseContentService.update(id, body, user);
  }

  // For Admin Partner
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.courseContentService.remove(id, user);
  }
}
