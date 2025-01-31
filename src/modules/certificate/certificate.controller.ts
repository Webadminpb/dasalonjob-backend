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
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER')
  create(@Body() body: CreateCertificateDto, @GetUser() user: Auth) {
    return this.certificateService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findAll(@GetUser() user: Auth) {
    return this.certificateService.findMyAllCertificates(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  findOne(@Param('id') id: string) {
    return this.certificateService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCertificateDto,
    @GetUser() user: Auth,
  ) {
    return this.certificateService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.certificateService.remove(id, user);
  }
}
