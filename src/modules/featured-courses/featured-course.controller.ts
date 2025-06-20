import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { FeaturedCourseService } from './featured-course.service';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { CreateFeaturedJobDto } from '../featured-jobs/dto/create-featured-job.dto';
import { QueryFeaturedCourseDto } from './dto/query-course.dto';
import { QueryFeaturedJobDto } from '../featured-jobs/dto/query-featured-job.dto';
import { UpdateFeaturedJobDto } from '../featured-jobs/dto/update-featured-job.dto';
import { Auth } from '@prisma/client';

@Controller('featured-courses')
export class FeaturedController {
  constructor(private readonly featuredCourseService: FeaturedCourseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  create(@Body() body: CreateFeaturedJobDto) {
    return this.featuredCourseService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findAll(@Query() query: QueryFeaturedCourseDto, @GetUser() user: Auth) {
    return this.featuredCourseService.findAll(query, user);
  }

  @Get('guest')
  @HttpCode(HttpStatus.OK)
  findAllForGuest(@Query() query: QueryFeaturedJobDto) {
    return this.featuredCourseService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  findOne(@Param('id') id: string) {
    return this.featuredCourseService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: UpdateFeaturedJobDto,
    @GetUser() user: Auth,
  ) {
    return this.featuredCourseService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.featuredCourseService.remove(id);
  }
}
