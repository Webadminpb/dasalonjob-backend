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
import { Auth } from '@prisma/client';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { CreateSaveCourseDto } from './dto/create-save-course.dto';
import { QuerySaveCourseDto } from './dto/query-save-course.dto';
import { SaveCourseService } from './save-course.service';
import { UpdateSaveCourseDto } from './dto/update-save-course.dto';

@Controller('save-course')
export class SaveCourseController {
  constructor(private readonly saveCourseService: SaveCourseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  async create(@Body() body: CreateSaveCourseDto, @GetUser() user: Auth) {
    return this.saveCourseService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findAll(@GetUser() user: Auth, @Query() query: QuerySaveCourseDto) {
    return this.saveCourseService.findAll(user, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findOne(@Param('id') id: string, @GetUser() user: Auth) {
    return this.saveCourseService.findOne(id, user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Param('id') id: string,
    @Body() body: UpdateSaveCourseDto,
    @GetUser() user: Auth,
  ) {
    return this.saveCourseService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.saveCourseService.remove(id, user);
  }
}
