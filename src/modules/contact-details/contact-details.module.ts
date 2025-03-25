import { Module } from '@nestjs/common';
import { ContactdetailsService } from './contact-details.service';
import { ContactdetailsController } from './contact-details.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ContactdetailsController],
  providers: [ContactdetailsService, PrismaService, JwtService],
})
export class ContactdetailsModule {}
