import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { CreditsService } from './credits.service';
import { CreateSpendCreditDto } from './dto/create-credit.dto';
import { query } from 'express';
import { QueryCreditbDto } from './dto/query-credit.dto';

@ApiTags('Credits')
@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Post('purchase/:creditPlanId')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER', 'PARTNER')
  async purchaseCreditPlan(
    @GetUser() user: Auth,
    @Param('creditPlanId') creditPlanId: string,
  ) {
    return this.creditsService.purchaseCreditPlan(user.id, creditPlanId);
  }

  @Post('spend')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER')
  async spendCredits(
    @Body() createSpendCreditDto: CreateSpendCreditDto,
    @GetUser() user: Auth,
  ) {
    return this.creditsService.spendCredits(user.id, createSpendCreditDto);
  }

  @Get('balance')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  async getCreditBalance(@GetUser() user: Auth) {
    return this.creditsService.getCreditBalance(user.id);
  }

  @Get('history/:userId')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  async getCreditHistory(@Param('userId') userId: string) {
    return this.creditsService.getCreditHistory(userId);
  }

  @Get('check-credits/:userId/:creditType')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  async checkCredits(
    @Param('userId') userId: string,
    @Param('creditType') creditType: 'JOB' | 'COURSE',
  ) {
    return this.creditsService.checkCredits(userId, creditType);
  }

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'PARTNER')
  async getCreditSummary(@GetUser() user: Auth) {
    return this.creditsService.getUserCreditsSummary(user.id);
  }

  @Get('transactions-history')
  @AllowAuthenticated()
  @HttpCode(HttpStatus.OK)
  async getWalletTransactionHistory(@Query() query: QueryCreditbDto) {
    const { userId, page, limit, search, dateRange } = query;

    return this.creditsService.getWalletTransactions(
      userId,
      page,
      limit,
      search,
      dateRange,
    );
  }
}
