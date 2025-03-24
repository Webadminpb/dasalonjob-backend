import { Module } from '@nestjs/common';
import { ContactdetailsService } from './contactdetails.service';
import { ContactdetailsController } from './contactdetails.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ContactdetailsController],
  providers: [ContactdetailsService, PrismaService, JwtService],
})
export class ContactdetailsModule {}
