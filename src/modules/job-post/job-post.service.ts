import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth, Prisma } from '@prisma/client';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { QueryJobPostDto } from './dto/query-job-post.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/common';

@Injectable()
export class JobPostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateJobPostDto, user: Auth) {
    const jobPost = await this.prismaService.jobPost.create({
      data: {
        jobBasicInfoId: body.jobBasicInfoId,
        jobBenefitsId: body.jobBenefitsId,
        jobQualificationId: body.jobQualificationId,
        jobDescriptionId: body.jobDescriptionId,
        skillId: body.skillId,
        countryId: body.countryId,
        languageIds: body.languageIds,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(true, 'Job post added', jobPost);
  }

  async findOne(id: string) {
    const jobPost = await this.prismaService.jobPost.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            venueDetails: true,
          },
        },
        jobBasicInfo: true,
        jobBenefits: true,
        jobDescription: true,
        jobQualification: true,
        languages: true,
        skills: true,
      },
    });
    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
    return new ApiSuccessResponse(true, 'Job post found', jobPost);
  }

  async findAll(query: QueryJobPostDto, user?: Auth) {
    const where: Prisma.JobPostWhereInput = {};
    if (user) {
      where.userId = user.id;
    }

    if (query.job_profile || query.search || query.job_type) {
      where.jobBasicInfo = {};

      if (query.job_profile) {
        where.jobBasicInfo.profile = query.job_profile;
      }

      if (query.search) {
        where.jobBasicInfo.title = {
          contains: query.search,
          mode: 'insensitive',
        };
      }

      if (query.job_type) {
        where.jobBasicInfo.jobType = query.job_type;
      }
    }

    if (query.status) {
      where.status = query.status;
    }
    if (query.countryId) {
      where.countryId = query.countryId;
    }

    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);

    console.log('query ', where, query);

    const [jobPost, total] = await Promise.all([
      await this.prismaService.jobPost.findMany({
        where,
        include: {
          user: {
            include: {
              venueDetails: true,
            },
          },
          jobBasicInfo: true,
          jobBenefits: true,
          jobDescription: true,
          jobQualification: true,
          languages: true,
          skills: true,
        },
        skip,
        take,
      }),
      this.prismaService.jobPost.count({ where, skip, take }),
    ]);
    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
    return new ApiSuccessResponse(true, 'Job post found', { total, jobPost });
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
