import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { SalondetailsService } from './salondetails.service';
import { CreateSalonDetailsDto } from './dto/create-salondetail.dto';
import { UpdateSalonDetailDto } from './dto/update-salondetail.dto';
import { Auth } from '@prisma/client';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';

@Controller('salon-details')
export class SalondetailsController {
  constructor(private readonly salondetailsService: SalondetailsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateSalonDetailsDto, @GetUser() user: Auth) {
    return this.salondetailsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMySalonDetails(@GetUser() user: Auth) {
    return this.salondetailsService.findMySalonDetails(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(@Body() body: UpdateSalonDetailDto, @GetUser() user: Auth) {
    return this.salondetailsService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth) {
    return this.salondetailsService.remove(user);
  }
}
