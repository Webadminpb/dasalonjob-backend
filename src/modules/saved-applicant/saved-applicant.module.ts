import { Module } from '@nestjs/common';
import { SavedApplicantService } from './saved-applicant.service';
import { SavedApplicantController } from './saved-applicant.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [SavedApplicantController],
  providers: [SavedApplicantService, PrismaService, JwtService],
})
export class SavedApplicantModule {}
