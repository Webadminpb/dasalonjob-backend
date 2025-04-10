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
  Query,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { AllowAuthenticated } from 'src/common/decorators/auth-decorator';
import { CreatePlanDto, QueryPlanDto, UpdatePlanDto } from './dto/plan.dto';

@Controller('subscription/plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('/admin')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  async create(@Body() dto: CreatePlanDto) {
    return this.planService.createSubscriptionPlan(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  async findAll(@Query() query: QueryPlanDto) {
    return this.planService.getAllSubscriptionPlans(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  async findOne(@Param('id') id: string) {
    return this.planService.getSubscriptionPlan(id);
  }

  @Patch('/admin/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  async update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.updateSubscriptionPlan(id, dto);
  }

  @Delete('/admin/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  async remove(@Param('id') id: string) {
    return this.planService.deleteSubscriptionPlan(id);
  }
}
