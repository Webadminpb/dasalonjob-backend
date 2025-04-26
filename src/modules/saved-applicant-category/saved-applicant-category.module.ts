import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SavedApplicantService } from '../saved-applicant/saved-applicant.service';
import { SavedApplicantCategoryController } from './saved-applicant-category.controller';
import { SavedApplicantCategoryService } from './saved-applicant-category.service';

@Module({
  imports: [],
  controllers: [SavedApplicantCategoryController],
  providers: [PrismaService, JwtService, SavedApplicantCategoryService],
})
export class SavedApplicantCategory {}
