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
import { UserLanguagesService } from './user-languages.service';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { Auth } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserLanguageDto } from './dto/create-user-language.dto';
import { UpdateUserLanguageDto } from './dto/update-user-language.dto';

@ApiTags('user partner agency admin superadmin')
@Controller('user-languages')
export class UserLanguagesController {
  constructor(private readonly userLanguagesService: UserLanguagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated()
  create(@Body() body: CreateUserLanguageDto, @GetUser() user: Auth) {
    return this.userLanguagesService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findAll(@GetUser() user: Auth) {
    return this.userLanguagesService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findOne(@Param('id') id: string) {
    return this.userLanguagesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  update(
    @Param('id') id: string,
    @Body() body: UpdateUserLanguageDto,
    @GetUser() user: Auth,
  ) {
    return this.userLanguagesService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.userLanguagesService.remove(id, user);
  }
}
