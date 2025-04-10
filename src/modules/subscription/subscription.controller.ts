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
import { SubscriptionService } from './subscription.service';
import {
  CreateSubscriptionDto,
  QuerySubscriptionDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import { AllowAuthenticated } from 'src/common/decorators/auth-decorator';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  async create(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN', 'AGENCY')
  async findAll(@Query() query: QuerySubscriptionDto) {
    return this.subscriptionService.getAllSubscriptions(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  async findOne(@Param('id') id: string) {
    return this.subscriptionService.getSubscription(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  async update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    return this.subscriptionService.updateSubscription(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  async remove(@Param('id') id: string) {
    return this.subscriptionService.deleteSubscription(id);
  }
}
