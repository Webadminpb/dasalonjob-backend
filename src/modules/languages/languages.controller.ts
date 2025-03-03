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
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@ApiTags('user partner agency')
@Controller('languages')
export class LangaugesController {
  constructor(private readonly langaugesService: LangaugesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER', 'AGENCY', 'PARTNER')
  create(@Body() body: CreateLanguageDto, @GetUser() user: Auth) {
    return this.langaugesService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY', 'PARTNER')
  findAll(@GetUser() user: Auth) {
    return this.langaugesService.findMyAllLangauges(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY', 'PARTNER')
  findOne(@Param('id') id: string) {
    return this.langaugesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY', 'PARTNER')
  update(
    @Param('id') id: string,
    @Body() body: UpdateLanguageDto,
    @GetUser() user: Auth,
  ) {
    return this.langaugesService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY', 'PARTNER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.langaugesService.remove(id, user);
  }
}
