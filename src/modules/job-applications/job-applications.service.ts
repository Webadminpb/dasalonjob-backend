import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { QueryJobApplicationDto } from './dto/query-job-application.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { Auth, JobApplicationStatus } from '@prisma/client';
import { getPaginationSkip, getPaginationTake } from 'src/common/common';
import { StatusJobApplicationDto } from './dto/status-job.dto';

@Injectable()
export class JobApplicationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateJobApplicationDto, user: Auth) {
    const existedJobApplication =
      await this.prismaService.jobApplication.findFirst({
        where: {
          jobPostId: body.jobPostId,
          userId: user.id,
        },
      });
    if (existedJobApplication) {
      throw new BadRequestException('job application already applied');
    }
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

  async findAll(query: QueryJobApplicationDto, user?: Auth) {
    const where: any = {};
    if (user.id) {
      where.jobPost = where.jobPost || {};

      where.jobPost.userId = user.id;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.location) {
      where.user = where.user || {};
      where.user.contactDetails = where.user.contactDetails || {};
      where.user.contactDetails.city = query.location;
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

    if (query.skills) {
      where.user = where.user || {};
      where.user.skills = {
        some: {
          skills: {
            has: query.skills.trim(),
          },
        },
      };
    }

    if (query.education) {
      where.user = where.user || {};
      where.user.educations = {
        some: {
          education: query.education,
        },
      };
    }

    if (query.isTrained) {
      where.user = where.user || {};
      where.user.isProfessional = Boolean(query.isTrained);
    }

    if (query.search) {
      where.OR = [
        {
          user: {
            contactDetails: {
              phoneNumber: {
                contains: query.search.trim(),
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    if (query.customDate) {
      const date = new Date(query.customDate);
      where.createdAt = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    // **Custom Year Filtering**
    if (query.customerYear) {
      const year = new Date(query.customerYear).getFullYear();
      where.createdAt = {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      };
    }

    const sortOrder = query.order === 'asc' ? 'asc' : 'desc';
    const sortBy = query.sort || 'createdAt';

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
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prismaService.jobApplication.count({ where, skip, take }),
    ]);

    return new ApiSuccessResponse(true, 'Job applications found', {
      total,
      jobApplications,
    });
  }

  async findTotalJobsAndApplicant(user: Auth) {
    const [totalJobs, totalApplicants] = await Promise.all([
      this.prismaService.jobPost.count({
        where: {
          userId: user.id,
        },
      }),
      await this.prismaService.jobApplication.count({
        where: {
          jobPost: {
            userId: user.id,
          },
        },
      }),
    ]);
    return new ApiSuccessResponse(true, 'Total jobs and applicants', {
      totalJobs,
      totalApplicants,
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

  async updateStatus(id: string, body: StatusJobApplicationDto, user: any) {
    const existingJobApplication =
      await this.prismaService.jobApplication.findUnique({
        where: { id, jobPost: { userId: user.id } },
        include: {
          jobPost: true,
        },
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
