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
  Put,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { AllowAuthenticated } from 'src/common/auth/auth-decorator';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('SUPER_ADMIN')
  create(@Body() body: CreateCountryDto) {
    return this.countryService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findAll() {
    return this.countryService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findOne(@Param('id') id: string) {
    return this.countryService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('SUPER_ADMIN')
  update(@Param('id') id: string, @Body() body: UpdateCountryDto) {
    return this.countryService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.countryService.remove(id);
  }
}
