import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BusinessTypeService } from './business-type.service';
import { AllowAuthenticated } from 'src/common/decorators/auth-decorator';
import { CreateBusinessTypeDto } from './dto/create-business-type.dto';
import { QueryBusinessTypeDto } from './dto/query-business-type.dto';

@Controller('   ')
export class BusinessTypeController {
  constructor(private readonly businessTypeService: BusinessTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated()
  create(@Body() body: CreateBusinessTypeDto) {
    return this.businessTypeService.create(body);
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated()
  update(@Param('id') id: string, @Body() body: CreateBusinessTypeDto) {
    return this.businessTypeService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated()
  delete(@Param('id') id: string) {
    return this.businessTypeService.delete(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated()
  findOne(@Param('id') id: string) {
    return this.businessTypeService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated()
  findMany(@Query() query: QueryBusinessTypeDto) {
    return this.businessTypeService.findMany(query);
  }
}
