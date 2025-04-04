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
  Query,
} from '@nestjs/common';
import { CreditPlansService } from './credit-plans.service';
import { CreateCreditPlanDto } from './dto/create-credit-plan.dto';
import { UpdateCreditPlanDto } from './dto/update-credit-plan.dto';
import { AllowAuthenticated } from 'src/common/decorators/auth-decorator';
import { QueryCreditPlanbDto } from './dto/query-credit-plan.dto';

@Controller('credit-plans')
export class CreditPlansController {
  constructor(private readonly creditPlansService: CreditPlansService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  create(@Body() body: CreateCreditPlanDto) {
    return this.creditPlansService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findAll(@Query() query: QueryCreditPlanbDto) {
    return this.creditPlansService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  findOne(@Param('id') id: string) {
    return this.creditPlansService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() body: UpdateCreditPlanDto) {
    return this.creditPlansService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.creditPlansService.remove(id);
  }
}
