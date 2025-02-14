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
} from '@nestjs/common';
import { LangaugesService } from './languages.service';
import { CreateLangaugeDto } from './dto/create-langauge.dto';
import { UpdateLangaugeDto } from './dto/update-langauge.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user partner agency')
@Controller('languages')
export class LangaugesController {
  constructor(private readonly langaugesService: LangaugesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER', 'AGENCY')
  create(@Body() body: CreateLangaugeDto, @GetUser() user: Auth) {
    return this.langaugesService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY')
  findAll(@GetUser() user: Auth) {
    return this.langaugesService.findMyAllLangauges(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY')
  findOne(@Param('id') id: string) {
    return this.langaugesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY')
  update(
    @Param('id') id: string,
    @Body() body: UpdateLangaugeDto,
    @GetUser() user: Auth,
  ) {
    return this.langaugesService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.langaugesService.remove(id, user);
  }
}
