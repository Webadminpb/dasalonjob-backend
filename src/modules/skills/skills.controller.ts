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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user partner agency')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post('admin')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('ADMIN')
  create(@Body() body: CreateSkillDto) {
    return this.skillsService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findAll() {
    return this.skillsService.findAll();
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Put('admin/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN')
  update(
    @Body() body: UpdateSkillDto,
    @GetUser() user: Auth,
    @Param('id') id: string,
  ) {
    return this.skillsService.update(id, body, user);
  }

  @Delete('admin/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
