import { Module } from '@nestjs/common';
import { WhatsappGroupsService } from './whatsapp-groups.service';
import { WhatsappGroupsController } from './whatsapp-groups.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [WhatsappGroupsController],
  providers: [WhatsappGroupsService, PrismaService, JwtService],
})
export class WhatsappGroupsModule {}
