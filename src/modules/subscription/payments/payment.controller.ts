import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  QueryPaymentDto,
  UpdatePaymentDto,
} from './dto/payment.dto';
import { AllowAuthenticated } from 'src/common/decorators/auth-decorator';

@Controller('subscription/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated()
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  getAllPayments(@Query() query: QueryPaymentDto) {
    return this.paymentService.getAllPayments(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  getPayment(@Param('id') id: string) {
    return this.paymentService.getPayment(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  updatePayment(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentService.updatePayment(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  deletePayment(@Param('id') id: string) {
    return this.paymentService.deletePayment(id);
  }
}
