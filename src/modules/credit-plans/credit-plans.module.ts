import { Module } from '@nestjs/common';
import { CreditPlansService } from './credit-plans.service';
import { CreditPlansController } from './credit-plans.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CreditPlansController],
  providers: [CreditPlansService, PrismaService, JwtService],
})
export class CreditPlansModule {}
