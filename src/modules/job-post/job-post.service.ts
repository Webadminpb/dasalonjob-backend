import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth, JobApplicationStatus, Prisma } from '@prisma/client';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { QueryJobPostDto } from './dto/query-job-post.dto';
import {
  getPaginationSkip,
  getPaginationTake,
  getSortBy,
  getSortOrder,
} from 'src/common/utils/common';
import { addDays } from 'date-fns';
import { CreateJobStatusDto } from './dto/status-job-post.dto';
import { PartnerAgencyPermissionService } from '../partner-agency-job-permission/partner-agency-job-permission.service';
@Injectable()
export class JobPostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly partnerAgencyJobPermissionService: PartnerAgencyPermissionService,
  ) {}

  async create(body: CreateJobPostDto, user: Auth) {
    if (
      user.role == 'ADMIN' ||
      user.role == 'SUPER_ADMIN' ||
      user.role == 'AGENCY'
    ) {
      const jobPost = await this.prismaService.jobPost.create({
        data: {
          jobBasicInfoId: body.jobBasicInfoId,
          jobBenefitsId: body.jobBenefitsId,
          jobQualificationId: body.jobQualificationId,
          jobDescriptionId: body.jobDescriptionId,
          venueId: body.venueId,
          countryId: body.countryId,
          userId: body.userId,
        },
      });
      return new ApiSuccessResponse(true, 'Job post added', jobPost);
    }
    const jobPost = await this.prismaService.jobPost.create({
      data: {
        jobBasicInfoId: body.jobBasicInfoId,
        jobBenefitsId: body.jobBenefitsId,
        jobQualificationId: body.jobQualificationId,
        jobDescriptionId: body.jobDescriptionId,
        venueId: body.venueId,
        countryId: body.countryId,
        userId: user.id,
      },
    });
    await this.prismaService.activity.create({
      data: {
        userId: user.id,
        type: 'POSTED_JOB',
      },
    });
    return new ApiSuccessResponse(true, 'Job post added', jobPost);
  }

  async findOneForPartner(id: string) {
    const [
      jobPost,
      applicantCount,
      savedCount,
      shortlistedCount,
      rejectedCount,
      acceptedCount,
    ] = await Promise.all([
      this.prismaService.jobPost.findUnique({
        where: { id },
        include: {
          user: true,
          venue: {
            include: {
              venueBasicDetails: true,
            },
          },
          jobBasicInfo: true,
          jobBenefits: true,
          jobDescription: true,
          jobQualification: {
            include: {
              skills: true,
              languages: {
                include: {
                  file: true,
                },
              },
            },
          },
        },
      }),
      this.prismaService.jobApplication.count({
        where: { jobPostId: id },
      }),
      this.prismaService.saveJobPost.count({
        where: { jobPostId: id },
      }),
      this.prismaService.jobApplication.count({
        where: { id, status: JobApplicationStatus.Shortlisted },
      }),
      this.prismaService.jobApplication.count({
        where: { id, status: JobApplicationStatus.Rejected },
      }),
      this.prismaService.jobApplication.count({
        where: { id, status: JobApplicationStatus.Accepted },
      }),
    ]);

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    return new ApiSuccessResponse(true, 'Job post found', {
      ...jobPost,
      applicantCount,
      savedCount,
      shortlistedCount,
      rejectedCount,
      acceptedCount,
      totalViews: jobPost?.views || 0,
    });
  }

  async findOne(id: string) {
    const [jobPost, update] = await this.prismaService.$transaction([
      this.prismaService.jobPost.findUnique({
        where: { id },
        include: {
          user: true,
          venue: {
            include: {
              venueBasicDetails: true,
            },
          },
          jobBasicInfo: true,
          jobBenefits: true,
          jobDescription: true,
          jobQualification: {
            include: {
              skills: true,
              languages: {
                include: {
                  file: true,
                },
              },
            },
          },
        },
      }),
      this.prismaService.jobPost.update({
        where: { id },
        data: {
          views: {
            increment: 1,
          },
        },
      }),
    ]);

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    return new ApiSuccessResponse(true, 'Job post found', jobPost);
  }

  async getJobStatusTotal() {
    const [totalApplicants, totalActives, totalPendings, totalFullfields] =
      await Promise.all([
        this.prismaService.auth.count({ where: { role: 'USER' } }),
        this.prismaService.jobPost.count({ where: { isOpen: true } }),
        this.prismaService.jobPost.count({ where: { status: 'Pending' } }),
        this.prismaService.jobPost.count({ where: { isOpen: false } }),
      ]);

    return new ApiSuccessResponse(true, 'Job post status total', {
      totalApplicants,
      totalActives,
      totalPendings,
      totalFullfields,
    });
  }

  async findAll(query: QueryJobPostDto, user?: Auth) {
    const where: Prisma.JobPostWhereInput = {};
    if (user) {
      where.userId = user.id;
    }

    if (query.job_profile || query.search || query.job_type) {
      where.jobBasicInfo = {};

      if (query.job_profile?.length) {
        where.jobBasicInfo.profile = {
          in: query.job_profile,
        };
      }

      if (query.search) {
        where.jobBasicInfo.title = {
          contains: query.search,
          mode: 'insensitive',
        };
      }

      if (query.job_type?.length) {
        where.jobBasicInfo.jobType = {
          in: query.job_type,
        };
      }

      if (query.minSalary !== undefined || query.maxSalary !== undefined) {
        const salaryFilter: any = {};

        if (query.minSalary !== undefined) {
          salaryFilter.start = { gte: query.minSalary };
        }

        if (query.maxSalary !== undefined) {
          salaryFilter.end = { lte: query.maxSalary };
        }

        where.jobBasicInfo.salaryRange = salaryFilter;
      }
    }

    if (query.status) {
      where.status = query.status;
    }
    if (query.countryId) {
      where.countryId = query.countryId;
    }

    if (query.experience) {
      where.jobQualification = {
        minExperience: query.experience,
      };
    }

    if (query.locations && query.locations.length > 0) {
      where.venue = {
        venueBasicDetails: {
          city: { in: query.locations },
        },
      };
    }

    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);
    const sortOrder = getSortOrder(query.order);
    const orderBy = getSortBy(query.sort);

    const [totalOpenJobs, totalFulfilledJobs] = await Promise.all([
      this.prismaService.jobPost.count({ where: { isOpen: true } }),
      this.prismaService.jobPost.count({ where: { isOpen: false } }),
    ]);

    const [jobPost, total] = await Promise.all([
      await this.prismaService.jobPost.findMany({
        where,
        include: {
          jobBasicInfo: true,
          jobBenefits: true,
          jobDescription: true,
          jobQualification: {
            include: {
              skills: true,
            },
          },
          venue: {
            include: {
              venueBasicDetails: {
                include: {
                  files: true,
                },
              },
            },
          },
          jobApplications: true,
          saveJobPosts: true,
        },
        skip,
        take,
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prismaService.jobPost.count({ where, skip, take }),
    ]);

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
    const jobPostWithCounts = jobPost.map((job: any) => ({
      ...job,
      totalApplicants: job.jobApplications.length,
      totalSaved: job.saveJobPosts.length,
    }));
    return new ApiSuccessResponse(true, 'Job post found', {
      total,
      totalOpenJobs,
      totalFulfilledJobs,
      jobPosts: jobPostWithCounts,
    });
  }

  async update(id: string, user: Auth, body: UpdateJobPostDto) {
    const existingJobPost = await this.prismaService.jobPost.findUnique({
      where: { id },
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
      where: { id },
    });
    if (!existingJobPost) {
      throw new NotFoundException('Job post not found');
    }
    await this.prismaService.jobPost.delete({
      where: { id: existingJobPost.id },
    });
    return new ApiSuccessResponse(true, 'Job post deleted', null);
  }

  async findExpiringJobs(query: QueryJobPostDto, user: Auth) {
    const today = new Date().toISOString();
    const nextWeek = addDays(today, 7).toISOString();
    console.log(
      await this.prismaService.jobPost.findMany({
        include: { jobBasicInfo: true },
      }),
    );
    const [expiringJobs, total] = await this.prismaService.jobPost.findMany({
      where: {
        userId: user.id,
        jobBasicInfo: {
          deadline: {
            gte: today,
            lte: nextWeek,
          },
        },
      },
      // skip: getPaginationSkip(query.page, query.limit),
      // take: getPaginationTake(query.limit),
      include: {
        jobBasicInfo: true,
      },
    });

    return new ApiSuccessResponse(true, 'partner jobs', {
      expiringJobs,
      total,
    });
  }

  async updateJobPostStatusByIdForAdmin(body: CreateJobStatusDto, user: Auth) {
    const existingJobPost = await this.prismaService.jobPost.findUnique({
      where: {
        id: body.id,
      },
    });
    if (!existingJobPost) {
      throw new NotFoundException('Job Post Not Found');
    }

    const updateJobPost = await this.prismaService.jobPost.update({
      where: {
        id: existingJobPost.id,
      },
      data: {
        status: body.status,
      },
    });
    if (body.status == 'Approved') {
      await this.prismaService.activity.create({
        data: {
          userId: user.id,
          type: 'APPROVE_JOB',
        },
      });
    } else if (body.status == 'Rejected') {
      await this.prismaService.activity.create({
        data: {
          userId: user.id,
          type: 'REJECT_JOB',
        },
      });
    }
    return new ApiSuccessResponse(
      true,
      'Job Status Updated Successfully',
      updateJobPost,
    );
  }

  async findAllForAdmin(query: QueryJobPostDto) {
    const where: Prisma.JobPostWhereInput = {};
    if (query.partnerId) {
      where.userId = query.partnerId;
    }

    if (query.job_profile || query.search || query.job_type) {
      where.jobBasicInfo = {};

      if (query.job_profile?.length) {
        where.jobBasicInfo.profile = {
          in: query.job_profile,
        };
      }

      if (query.search) {
        where.jobBasicInfo.title = {
          contains: query.search,
          mode: 'insensitive',
        };
      }

      if (query.job_type?.length) {
        where.jobBasicInfo.jobType = {
          in: query.job_type,
        };
      }

      if (query.minSalary !== undefined || query.maxSalary !== undefined) {
        const salaryFilter: any = {};

        if (query.minSalary !== undefined) {
          salaryFilter.start = { gte: query.minSalary };
        }

        if (query.maxSalary !== undefined) {
          salaryFilter.end = { lte: query.maxSalary };
        }

        where.jobBasicInfo.salaryRange = salaryFilter;
      }
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.date) {
      where.createdAt = {
        gte: new Date(query.date).toISOString(),
      };
    }

    if (query.countryId) {
      where.countryId = query.countryId;
    }

    if (query.experience) {
      where.jobQualification = {
        minExperience: query.experience,
      };
    }

    if (query.locations && query.locations.length > 0) {
      where.venue = {
        venueBasicDetails: {
          city: { in: query.locations },
        },
      };
    }

    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);
    const sortOrder = getSortOrder(query.order);
    const orderBy = getSortBy(query.sort);

    const [totalOpenJobs, totalFulfilledJobs, totalPendingJobs] =
      await Promise.all([
        this.prismaService.jobPost.count({ where: { isOpen: true } }),
        this.prismaService.jobPost.count({ where: { isOpen: false } }),
        this.prismaService.jobPost.count({ where: { status: 'Pending' } }),
      ]);

    const [jobPost, total] = await Promise.all([
      await this.prismaService.jobPost.findMany({
        where,
        include: {
          jobBasicInfo: {
            include: {
              venue: {
                include: {
                  venueBasicDetails: {
                    include: {
                      files: true,
                    },
                  },
                },
              },
            },
          },
          jobBenefits: true,
          jobDescription: true,
          jobQualification: {
            include: {
              skills: true,
            },
          },
          jobApplications: true,
          saveJobPosts: true,
        },

        skip,
        take,
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prismaService.jobPost.count({ where, skip, take }),
    ]);

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
    const jobPostWithCounts = jobPost.map((job: any) => ({
      ...job,
      totalApplicants: job.jobApplications.length,
      totalSaved: job.saveJobPosts.length,
    }));
    return new ApiSuccessResponse(true, 'Job post found', {
      total,
      totalOpenJobs,
      totalFulfilledJobs,
      totalPendingJobs,
      jobPosts: jobPostWithCounts,
    });
  }

  async findJobsForAgency(query: QueryJobPostDto, user: Auth) {
    if (query.partnerId) {
      const hasPermission =
        await this.partnerAgencyJobPermissionService.checkPermission(
          query.partnerId,
          user.id,
        );

      if (hasPermission === false) {
        throw new NotFoundException(
          'You do not have permission to view these jobs',
        );
      }
    }

    const where: Prisma.JobPostWhereInput = {};

    if (query.partnerId) {
      where.userId = query.partnerId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        {
          jobBasicInfo: {
            title: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
        {
          jobDescription: {
            description: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);
    const sortOrder = getSortOrder(query.order);
    const orderBy = getSortBy(query.sort);

    const [jobs, total] = await Promise.all([
      this.prismaService.jobPost.findMany({
        where,
        include: {
          jobBasicInfo: true,
          jobDescription: true,
          jobBenefits: true,
          jobQualification: true,
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              basicDetails: true,
            },
          },
          venue: {
            include: {
              venueBasicDetails: true,
            },
          },
          jobApplications: true,
        },
        skip,
        take,
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prismaService.jobPost.count({ where }),
    ]);

    const jobsWithStats = jobs.map((job) => ({
      ...job,
      totalApplications: job.jobApplications.length,
    }));

    return new ApiSuccessResponse(true, 'Jobs fetched successfully', {
      total,
      jobs: jobsWithStats,
    });
  }

  // private async checkPermission(partnerId: string, agencyId: string) {
  //   const permission =
  //     await this.prismaService.partnerAgencyJobPermission.findUnique({
  //       where: {
  //         agencyId_partnerId: {
  //           agencyId,
  //           partnerId,
  //         },
  //       },
  //     });

  //   return permission?.hasAccess || false;
  // }
}
