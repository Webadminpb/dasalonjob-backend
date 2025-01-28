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
import { BasicdetailsService } from './basicdetails.service';
import { CreateBasicdetailDto } from './dto/create-basicdetail.dto';
import { UpdateBasicdetailDto } from './dto/update-basicdetail.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';

@Controller('basicdetails')
export class BasicdetailsController {
  constructor(private readonly basicdetailsService: BasicdetailsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER')
  create(@Body() body: CreateBasicdetailDto, @GetUser() user: Auth) {
    return this.basicdetailsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findMyBasicDetails(@GetUser() user: Auth) {
    return this.basicdetailsService.findOne(user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  update(
    @Param('id') id: string,
    @Body() body: UpdateBasicdetailDto,
    @GetUser() user: Auth,
  ) {
    return this.basicdetailsService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.basicdetailsService.remove(id, user);
  }
}
