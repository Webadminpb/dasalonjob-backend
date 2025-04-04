import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreateSpendCreditDto } from './dto/create-credit.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { Auth } from '@prisma/client';

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
  async checkCredits(
    @Param('userId') userId: string,
    @Param('creditType') creditType: 'JOB' | 'COURSE',
  ) {
    return this.creditsService.checkCredits(userId, creditType);
  }
}
