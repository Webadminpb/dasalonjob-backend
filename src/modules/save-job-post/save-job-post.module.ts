import { Module } from '@nestjs/common';
import { SaveJobPostService } from './save-job-post.service';
import { SaveJobPostController } from './save-job-post.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SaveJobPostController],
  providers: [SaveJobPostService, PrismaService, JwtService],
})
export class SaveJobPostModule {}
