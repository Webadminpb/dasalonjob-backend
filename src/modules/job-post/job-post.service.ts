import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { UpdateJobPostDto } from './dto/update-job-post.dto';

@Injectable()
export class JobPostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateJobPostDto, user: Auth) {
    const jobPost = await this.prismaService.jobPost.create({
      data: {
        jobBasicInfoId: body.jobBasicInfoId,
        jobBenefitsId: body.jobBenefitsId,
        jobQualificationId: body.jobQualificationId,
        skillId: body.skillId,
        languageIds: body.languageIds,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(true, 'Job post added', jobPost);
  }

  async findOne(id: string) {
    const jobPost = await this.prismaService.jobPost.findUnique({
      where: { id },
    });
    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
    return new ApiSuccessResponse(true, 'Job post found', jobPost);
  }

  async findAll(user: Auth) {
    const [jobPost, total] = await Promise.all([
      await this.prismaService.jobPost.findUnique({
        where: { userId: user.id },
        include: {
          user: true,
          jobBasicInfo: true,
          jobBenefits: true,
          jobDescription: true,
          jobQualification: true,
          languages: true,
          skills: true,
        },
      }),
      this.prismaService.jobPost.count({ where: { userId: user.id } }),
    ]);
    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
    return new ApiSuccessResponse(true, 'Job post found', { jobPost, total });
  }

  async update(id: string, user: Auth, body: UpdateJobPostDto) {
    const existingJobPost = await this.prismaService.jobPost.findUnique({
      where: { userId: user.id, id },
    });
    if (!existingJobPost) {
      throw new NotFoundException('Job post not found');
    }
    const updatedJobPost = await this.prismaService.jobPost.update({
      where: { id: existingJobPost.id },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(true, 'Job post updated', updatedJobPost);
  }

  async remove(id: string, user: Auth) {
    const existingJobPost = await this.prismaService.jobPost.findUnique({
      where: { userId: user.id, id },
    });
    if (!existingJobPost) {
      throw new NotFoundException('Job post not found');
    }
    await this.prismaService.jobPost.delete({
      where: { id: existingJobPost.id },
    });
    return new ApiSuccessResponse(true, 'Job post deleted', null);
  }
}
