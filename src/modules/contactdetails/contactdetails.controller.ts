import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ContactdetailsService } from './contactdetails.service';
import { UpdateContactdetailDto } from './dto/update-contactdetail.dto';
import { CreateContactDetailsDto } from './dto/create-contactdetail.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('applicant')
@Controller('contactdetails')
export class ContactdetailsController {
  constructor(private readonly contactdetailsService: ContactdetailsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER')
  create(@Body() body: CreateContactDetailsDto, @GetUser() user: Auth) {
    return this.contactdetailsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findMyContactDetails(@GetUser() user: Auth) {
    return this.contactdetailsService.findMyContactDetails(user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  update(
    @Param('id') id: string,
    @Body() updateContactdetailDto: UpdateContactdetailDto,
    @GetUser() user: Auth,
  ) {
    return this.contactdetailsService.update(id, updateContactdetailDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.contactdetailsService.remove(id, user);
  }
}
