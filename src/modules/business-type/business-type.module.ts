import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessTypeService } from './business-type.service';
import { JwtService } from '@nestjs/jwt';
import { BusinessTypeController } from './business-type.controller';

@Module({
  imports: [],
  providers: [PrismaService, BusinessTypeService, JwtService],
  controllers: [BusinessTypeController],
  exports: [],
})
export class BusinessTypeModule {}
