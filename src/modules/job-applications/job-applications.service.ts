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
import {
  Auth,
  JobApplicationStatus,
  Language,
  Prisma,
  Skills,
} from '@prisma/client';
import {
  getPaginationSkip,
  getPaginationTake,
  getSortBy,
  getSortOrder,
} from 'src/common/utils/common';
import { StatusJobApplicationDto } from './dto/status-job.dto';
import { permission } from 'process';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NOTIFICATION_EVENT } from '../notifications/notification.event';

@Injectable()
export class JobApplicationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(body: CreateJobApplicationDto, user: Auth) {
    const existedJobApplication =
      await this.prismaService.jobApplication.findFirst({
        where: {
          jobPostId: body.jobPostId,
          userId: user.id,
          message: body.message,
        },
      });
    if (existedJobApplication) {
      throw new BadRequestException('job application already applied');
    }
    const jobApplication = await this.prismaService.jobApplication.create({
      data: {
        userId: user.id,
        jobPostId: body.jobPostId,
        message: body.message,
      },
    });
    await this.prismaService.activity.create({
      data: {
        userId: user.id,
        type: 'APPLIED_JOB',
        jobApplicationId: jobApplication.id,
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
        user: {
          include: {
            jobPreference: true,
            profileImage: true,
            languages: true,
            educations: true,
            basicDetails: true,
            contactDetails: true,
          },
        },
        jobPost: true,
        applicantMessage: true,
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

  async findAllForPartner(query: QueryJobApplicationDto, user?: Auth) {
    const where: any = {};

    if (user?.id) {
      where.jobPost = where.jobPost || {};

      where.jobPost.userId = user.id;
    }

    if (query.jobPostId) {
      where.jobPostId = query.jobPostId;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.location) {
      where.user = where.user || {};
      where.user.contactDetails = where.user.contactDetails || {};
      where.user.contactDetails.city = query.location;
    }

    if (query.languageId) {
      where.user = {
        languages: {
          languageId: query.languageId,
        },
      };
    }

    if (query.skillId) {
      where.user = where.user || {};
      where.user.jobPreference = {
        some: {
          skillsIds: {
            hasSome: query.skillId,
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

    const baseCountWhere = {
      jobPost: {
        userId: user?.id ?? query.partnerId,
      },
      ...(query.jobPostId && { jobPostId: query.jobPostId }),
    };

    const [
      jobApplications,
      appliedTotal,
      acceptedTotal,
      shortlistedTotal,
      rejectedTotal,
      total,
      totalJobs,
    ] = await Promise.all([
      this.prismaService.jobApplication.findMany({
        where,
        include: {
          user: {
            include: {
              jobPreference: {
                include: {
                  skills: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              profileImage: true,
              PastWork: {
                include: {
                  files: true,
                },
              },
              pastExperiences: true,
              experiences: {
                include: {
                  profile: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              certificates: {
                include: {
                  file: true,
                },
              },
              languages: {
                include: {
                  language: {
                    include: {
                      file: {
                        select: { url: true },
                      },
                    },
                  },
                },
              },
              educations: true,
              basicDetails: true,
              contactDetails: true,
              // jobApplicationApplicantMessage: true,
            },
          },
          jobPost: {
            include: {
              // user: {
              //   include: {
              //     experiences: true,
              //     pastExperiences: true,
              //     certificates: {
              //       include: {
              //         file: true,
              //       },
              //     },
              //   },
              // },
              jobQualification: true,
              jobBasicInfo: true,
            },
          },
        },
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          ...baseCountWhere,
          status: JobApplicationStatus.Applied,
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          ...baseCountWhere,
          status: JobApplicationStatus.Accepted,
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          ...baseCountWhere,
          status: JobApplicationStatus.Shortlisted,
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          ...baseCountWhere,
          status: JobApplicationStatus.Rejected,
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          jobPost: {
            userId: user?.id,
          },
        },
      }),
      this.prismaService.jobPost.count({
        where: {
          userId: user?.id,
        },
      }),
    ]);

    const applicationsWithMatches = jobApplications.map((application) => {
      const jobRequiredSkillIds =
        application.jobPost?.jobQualification?.skillIds?.map((skill: any) => {
          return skill;
        }) || [];
      const jobRequiredLanguages =
        application.jobPost?.jobQualification?.languageIds?.map(
          (lang: any) => lang,
        ) || [];
      const jobRequiredEducation =
        application.jobPost?.jobQualification?.education;

      const userSkills = application.user?.jobPreference?.skillsIds || [];
      const userLanguages =
        application.user?.languages?.map((lang) => lang.languageId) || [];
      const userEducations =
        application.user?.educations?.map((edu) => edu.education) || [];

      const matchingSkills = jobRequiredSkillIds.filter((id) =>
        userSkills.includes(id),
      );
      const matchingLanguages = jobRequiredLanguages.filter((id) =>
        userLanguages.includes(id),
      );
      const matchingEducation = userEducations.includes(jobRequiredEducation);

      return {
        ...application,
        matchingSkills,
        matchingLanguages,
        matchingEducation,
      };
    });

    return new ApiSuccessResponse(true, 'Job applications found', {
      jobApplications: applicationsWithMatches,
      appliedTotal,
      acceptedTotal,
      shortlistedTotal,
      rejectedTotal,
      total,
      totalJobs,
    });
  }

  async findAllForAdmin(query: QueryJobApplicationDto) {
    const where: any = {};
    if (query.partnerId) {
      where.jobPost = where.jobPost || {};

      where.jobPost.userId = query.partnerId;
    }
    if (query.jobPostId) {
      where.jobPostId = query.jobPostId;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.location) {
      where.user = where.user || {};
      where.user.contactDetails = where.user.contactDetails || {};
      where.user.contactDetails.city = query.location;
    }

    if (query.languageId) {
      where.user = {
        languages: {
          languageId: query.languageId,
        },
      };
    }

    if (query.skillId) {
      where.user = where.user || {};
      where.user.jobPreference = {
        some: {
          skillsIds: {
            hasSome: query.skillId,
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
    console.log('job application query id ', query.partnerId);
    const count = await this.prismaService.jobApplication.count({
      where: {
        jobPostId: query.jobPostId,
        status: JobApplicationStatus.Applied,
      },
    });

    const [
      jobApplications,
      appliedTotal,
      acceptedTotal,
      shortlistedTotal,
      rejectedTotal,
    ] = await Promise.all([
      this.prismaService.jobApplication.findMany({
        where,
        include: {
          user: {
            include: {
              jobPreference: true,
              profileImage: true,
              languages: true,
              educations: true,
              basicDetails: true,
              contactDetails: true,
              jobApplicationApplicantMessage: true,
            },
          },
          jobPost: {
            include: {
              user: true,
              jobBasicInfo: true,
            },
          },
        },
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          jobPostId: query.jobPostId,
          status: JobApplicationStatus.Applied,
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          jobPostId: query.jobPostId,
          status: JobApplicationStatus.Accepted,
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          jobPostId: query.jobPostId,
          status: JobApplicationStatus.Shortlisted,
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          jobPostId: query.jobPostId,
          status: JobApplicationStatus.Rejected,
        },
      }),
    ]);

    return new ApiSuccessResponse(true, 'Job applications found', {
      jobApplications,
      appliedTotal,
      acceptedTotal,
      shortlistedTotal,
      rejectedTotal,
    });
  }

  async findAllForApplicant(query: QueryJobApplicationDto, user?: Auth) {
    const where: any = {};
    if (user.id) {
      where.userId = user.id;
    }

    if (query.status) {
      where.status = query.status;
    }
    if (query.location) {
      where.user = where.user || {};
      where.user.contactDetails = where.user.contactDetails || {};
      where.user.contactDetails.city = query.location;
    }

    if (query.languageId) {
      where.user = {
        languages: {
          languageId: query.languageId,
        },
      };
    }

    if (query.skillId) {
      where.user = where.user || {};
      where.user.jobPreference = {
        some: {
          skillsIds: {
            hasSome: query.skillId,
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
              jobPreference: true,
              profileImage: true,
              languages: true,
              educations: true,
              basicDetails: true,
              contactDetails: true,
            },
          },
          jobPost: {
            include: {
              user: true,
              jobBasicInfo: true,
              venue: {
                include: {
                  venueBasicDetails: true,
                  logo: true,
                },
              },
              saveJobPosts: {
                where: {
                  userId: user?.id,
                },
                select: { id: true },
              },
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

    this.eventEmitter.emit(NOTIFICATION_EVENT, {
      // isBroadCast: true,
      userId: existingJobApplication?.userId,
      title: `Job Application Status Changed To ${body?.status}`,
      body: `Job Application Status Changed To ${body?.status}`,
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

  async getAgencyRecentApplicants(query: QueryJobApplicationDto, user: Auth) {
    const where: Prisma.JobApplicationWhereInput = {};
    const orderBy = getSortOrder(query.order);
    const sortBy = getSortBy(query.sort);

    const [existedJobApplications, totalExistingJobApplications] =
      await Promise.all([
        this.prismaService.jobApplication.findMany({
          where,
          orderBy: {
            [sortBy]: [orderBy],
          },
        }),
        this.prismaService.jobApplication.count(),
      ]);
    if (!existedJobApplications) {
      throw new NotFoundException('No recent applicants found');
    }
    return new ApiSuccessResponse(true, 'Recent Applicants', {
      existedJobApplications,
      totalExistingJobApplications,
    });
  }

  async getAgencyJobApplicants(query: QueryJobApplicationDto, user: Auth) {
    const permissions =
      await this.prismaService.partnerAgencyJobPermission.findMany({
        where: {
          agencyId: user.id,
          partnerHasAccess: true,
          agencyHasAccess: true,
        },
        select: {
          venue: {
            select: {
              userId: true,
            },
          },
        },
      });
    const partnerIds = permissions.map((p) => p.venue.userId);
    if (partnerIds.length === 0) return [];

    const jobPosts = await this.prismaService.jobPost.findMany({
      where: {
        userId: { in: partnerIds },
      },
      skip: getPaginationSkip(query.page, query.limit),
      take: getPaginationTake(query.limit),
      select: {
        id: true,
      },
    });

    const jobPostIds = jobPosts.map((j) => j.id);
    if (jobPostIds.length === 0) return [];

    const [applications, total] = await Promise.all([
      this.prismaService.jobApplication.findMany({
        where: {
          jobPostId: { in: jobPostIds },
        },
        include: {
          user: true,
          jobPost: true,
        },
      }),
      this.prismaService.jobApplication.count({}),
    ]);
    return new ApiSuccessResponse(true, 'Applicants fetched successfully', {
      applications,
      total,
    });
  }
}
