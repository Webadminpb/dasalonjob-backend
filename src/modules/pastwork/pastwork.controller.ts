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
} from '@nestjs/common';
import { PastworkService } from './pastwork.service';
import { CreatePastworkDto } from './dto/create-pastwork.dto';
import { UpdatePastworkDto } from './dto/update-pastwork.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';

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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  update(
    @Param('id') id: string,
    @Body() body: UpdatePastworkDto,
    @GetUser() user: Auth,
  ) {
    return this.pastworkService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.pastworkService.remove(id, user);
  }
}
