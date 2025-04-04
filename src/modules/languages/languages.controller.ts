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
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { Auth } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@ApiTags('user partner agency admin superadmin')
@Controller('languages')
export class LangaugesController {
  constructor(private readonly langaugesService: LangaugesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  create(@Body() body: CreateLanguageDto) {
    return this.langaugesService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findAll() {
    return this.langaugesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findOne(@Param('id') id: string) {
    return this.langaugesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('SUPER_ADMIN', 'ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: UpdateLanguageDto,
    @GetUser() user: Auth,
  ) {
    return this.langaugesService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('SUPER_ADMIN', 'ADMIN')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.langaugesService.remove(id, user);
  }
}
