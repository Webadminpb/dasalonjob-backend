import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { QueryJobApplicationDto } from './dto/query-job-application.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { Auth, JobApplicationStatus } from '@prisma/client';
import { getPaginationSkip, getPaginationTake } from 'src/common/common';

@Injectable()
export class JobApplicationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateJobApplicationDto, user: Auth) {
    const jobApplication = await this.prismaService.jobApplication.create({
      data: {
        userId: user.id,
        jobPostId: body.jobPostId,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Job application created',
      jobApplication,
    );
  }

  async findOne(id: string) {
    const jobApplication = await this.prismaService.jobApplication.findUnique({
      where: { id },
      include: {
        user: true,
        jobPost: true,
      },
    });
    if (!jobApplication) {
      throw new NotFoundException('Job application not found');
    }
    return new ApiSuccessResponse(
      true,
      'Job application found',
      jobApplication,
    );
  }

  async findAll(query: QueryJobApplicationDto, user?: any) {
    const where: any = {};
    if (user.id) {
      where.jobPost.userId = user.id;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.skills) {
      where.user = {
        skills: {
          some: {
            skills: {
              has: query.skills.trim(),
            },
          },
        },
      };
    }

    if (query.language) {
      where.user = {
        languages: {
          some: {
            language: query.language,
          },
        },
      };
    }
    if (query.education) {
      where.user.education = query.education;
    }
    if (query.isTrained) {
      where.user.isTrained = query.isTrained;
    }
    if (query.search) {
      where.OR = [
        {
          user: {
            basicDetails: {
              fullName: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          user: {
            contactDetails: {
              phoneNumber: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);

    const [jobApplications, total] = await Promise.all([
      this.prismaService.jobApplication.findMany({
        where,
        include: {
          user: {
            include: {
              skills: true,
              languages: true,
              educations: true,
              basicDetails: true,
              contactDetails: true,
            },
          },
          jobPost: {
            include: {
              user: true,
            },
          },
        },
        skip,
        take,
      }),
      this.prismaService.jobApplication.count({ where }),
    ]);

    return new ApiSuccessResponse(true, 'Job applications found', {
      total,
      jobApplications,
    });
  }

  async update(id: string, body: UpdateJobApplicationDto, user: any) {
    const existingJobApplication =
      await this.prismaService.jobApplication.findUnique({
        where: { id, userId: user.id },
      });
    if (!existingJobApplication) {
      throw new NotFoundException('Job application not found');
    }
    const updatedJobApplication =
      await this.prismaService.jobApplication.update({
        where: { id },
        data: {
          ...body,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Job application updated',
      updatedJobApplication,
    );
  }

  async remove(id: string, user: any) {
    const existingJobApplication =
      await this.prismaService.jobApplication.findUnique({
        where: { id, userId: user.id },
      });
    if (!existingJobApplication) {
      throw new NotFoundException('Job application not found');
    }
    await this.prismaService.jobApplication.delete({
      where: { id },
    });
    return new ApiSuccessResponse(true, 'Job application deleted', null);
  }
}
