import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PartnerCourseService } from './partner-course.service';
import { CreatePartnerCourseDto } from './dto/create-partner-course.dto';
import { UpdatePartnerCourseDto } from './dto/update-partner-course.dto';
import { GetUser } from 'src/common/auth/auth-decorator';
import { userInfo } from 'os';
import { Auth } from '@prisma/client';

@Controller('partner-course')
export class PartnerCourseController {
  constructor(private readonly partnerCourseService: PartnerCourseService) {}

  @Post()
  create(
    @Body() createPartnerCourseDto: CreatePartnerCourseDto,
    @GetUser() user: Auth,
  ) {
    return this.partnerCourseService.create(createPartnerCourseDto, user);
  }

  @Get()
  findAll() {
    return this.partnerCourseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnerCourseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePartnerCourseDto: UpdatePartnerCourseDto,
    @GetUser() user: Auth,
  ) {
    return this.partnerCourseService.update(id, updatePartnerCourseDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.partnerCourseService.remove(id);
  }
}
