import { Module } from '@nestjs/common';
import { UserLanguagesService } from './user-languages.service';
import { UserLanguagesController } from './user-languages.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserLanguagesController],
  providers: [UserLanguagesService, PrismaService, JwtService],
})
export class UserLanguagesModule {}
