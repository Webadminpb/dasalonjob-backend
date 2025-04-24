import { Module } from '@nestjs/common';
import { JobOfferToSavedApplicantService } from './jobOfferToSavedApplicant.service';
import { JobOfferToSavedApplicantController } from './jobOfferToSavedApplicant.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [JobOfferToSavedApplicantController],
  providers: [JobOfferToSavedApplicantService, PrismaService, JwtService],
})
export class JobOfferToSavedApplicantModule {}
