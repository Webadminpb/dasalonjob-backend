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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER', 'PARTNER', 'AGENCY')
  create(@Body() body: CreateSkillDto, @GetUser() user: Auth) {
    return this.skillsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'PARTNER', 'AGENCY')
  findMySkills(@GetUser() user: Auth) {
    return this.skillsService.findMySkills(user);
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'PARTNER', 'AGENCY')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'PARTNER', 'AGENCY')
  update(@Body() body: UpdateSkillDto, @GetUser() user: Auth) {
    return this.skillsService.update(body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'PARTNER', 'AGENCY')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.skillsService.remove(id, user);
  }
}
