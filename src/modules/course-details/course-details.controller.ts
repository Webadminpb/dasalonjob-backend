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
import { CourseDetailsService } from './course-details.service';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreateCourseDetailsDto } from './dto/create-course-detail.dto';
import { UpdateCourseDetailsDto } from './dto/update-course-detail.dto';
import { Auth } from '@prisma/client';

@ApiTags('course-details')
@Controller('course-details')
export class CourseDetailsController {
  constructor(private readonly courseDetailsService: CourseDetailsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('SUPER_ADMIN')
  create(@Body() body: CreateCourseDetailsDto) {
    return this.courseDetailsService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findAll(@GetUser() user: Auth) {
    return this.courseDetailsService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findOne(@Param('id') id: string) {
    return this.courseDetailsService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('SUPER_ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCourseDetailsDto,
    @GetUser() user: Auth,
  ) {
    return this.courseDetailsService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('SUPER_ADMIN')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.courseDetailsService.remove(id, user);
  }
}
