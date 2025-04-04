import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { PastworkService } from './pastwork.service';
import { CreatePastworkDto } from './dto/create-pastwork.dto';
import { UpdatePastworkDto } from './dto/update-pastwork.dto';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { Auth } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('applicant')
@Controller('pastwork')
export class PastworkController {
  constructor(private readonly pastworkService: PastworkService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER')
  create(@Body() body: CreatePastworkDto, @GetUser() user: Auth) {
    return this.pastworkService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findMyPastWork(@GetUser() user: Auth) {
    return this.pastworkService.findMyPastWork(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  update(@Body() body: UpdatePastworkDto, @GetUser() user: Auth) {
    return this.pastworkService.update(body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.pastworkService.remove(id, user);
  }
}
