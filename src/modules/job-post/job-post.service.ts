import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Auth,
  JobApplicationStatus,
  Prisma,
  UserExperience,
} from '@prisma/client';
import { addDays } from 'date-fns';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import {
  getPaginationSkip,
  getPaginationTake,
  getSortBy,
  getSortOrder,
} from 'src/common/utils/common';
import { PartnerAgencyPermissionService } from '../partner-agency-job-permission/partner-agency-job-permission.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import {
  QueryJobPostDto,
  QueryJobPostDtoForAdmin,
} from './dto/query-job-post.dto';
import { CreateJobStatusDto } from './dto/status-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { number } from 'zod';

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
        jobId: jobPost.id,
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
          user: {
            include: {
              partnerSocialLinks: true,
            },
          },
          venue: {
            include: {
              logo: true,
              venueBasicDetails: {
                include: {
                  files: true,
                },
              },
            },
          },
          jobBasicInfo: {
            include: {
              profile: {
                select: {
                  name: true,
                },
              },
            },
          },
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

  async findOneForAgency(id: string) {
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
              logo: true,
              venueBasicDetails: {
                include: {
                  files: true,
                },
              },
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

  async findOne(id: string, user?: Auth) {
    const jobPost = await this.prismaService.jobPost.findUnique({
      where: { id },
      include: {
        user: true,
        venue: {
          include: {
            venueBasicDetails: {
              include: {
                files: true,
              },
            },
            logo: true,
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
        jobApplications: {
          where: {
            userId: user.id,
          },
        },
        saveJobPosts: {
          where: {
            userId: user?.id,
          },
        },
      },
    });
    if (!jobPost) throw new NotFoundException('Job post is not found');
    const updateJobPost = await this.prismaService.jobPost.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    // ]);

    const jobRequiredSkillIds =
      jobPost?.jobQualification?.skills?.map((skill) => skill?.id) || [];

    const jobRequiredLanguages =
      jobPost?.jobQualification?.languages?.map((language) => language?.id) ||
      [];

    const jobRequiredEducations = jobPost?.jobQualification?.education;

    const userSkills = await this.prismaService.jobPreference.findUnique({
      where: {
        userId: user?.id,
      },
      select: {
        skills: {
          select: {
            id: true,
          },
        },
      },
    });

    const userLanguages = await this.prismaService.userLanguage.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        languageId: true,
      },
    });

    const userEducation = await this.prismaService.education.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        education: true,
      },
      orderBy: {
        education: 'desc',
      },
    });

    const matchingSkills = jobRequiredSkillIds?.filter((id) =>
      userSkills?.skills?.some((skill) => skill?.id === id),
    );

    const matchingLanguages = jobRequiredLanguages?.filter((id) =>
      userLanguages.some((lang) => lang.languageId === id),
    );

    const matchingEducation = userEducation.some(
      (edu) => edu.education === jobRequiredEducations,
    );

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    return new ApiSuccessResponse(true, 'Job post found', {
      jobPost,
      matchingSkills,
      matchingLanguages,
      matchingEducation,
    });
  }
  async findOneForGuest(id: string) {
    const jobPost = await this.prismaService.jobPost.findUnique({
      where: { id },
      include: {
        user: true,
        venue: {
          include: {
            venueBasicDetails: {
              include: {
                files: true,
              },
            },
            logo: true,
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
    });
    if (!jobPost) throw new NotFoundException('Job post is not found');
    const updateJobPost = await this.prismaService.jobPost.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    // ]);

    const jobRequiredSkillIds =
      jobPost?.jobQualification?.skills?.map((skill) => skill?.id) || [];

    const jobRequiredLanguages =
      jobPost?.jobQualification?.languages?.map((language) => language?.id) ||
      [];

    const jobRequiredEducations = jobPost?.jobQualification?.education;

    // const userSkills = await this.prismaService.jobPreference.findUnique({
    //   where: {
    //     userId: user?.id,
    //   },
    //   select: {
    //     skills: {
    //       select: {
    //         id: true,
    //       },
    //     },
    //   },
    // });

    // const userLanguages = await this.prismaService.userLanguage.findMany({
    //   where: {
    //     userId: user?.id,
    //   },
    //   select: {
    //     languageId: true,
    //   },
    // });

    // const userEducation = await this.prismaService.education.findMany({
    //   where: {
    //     userId: user?.id,
    //   },
    //   select: {
    //     education: true,
    //   },
    //   orderBy: {
    //     education: 'desc',
    //   },
    // });

    // const matchingSkills = jobRequiredSkillIds?.filter((id) =>
    //   userSkills?.skills?.some((skill) => skill?.id === id),
    // );

    // const matchingLanguages = jobRequiredLanguages?.filter((id) =>
    //   userLanguages.some((lang) => lang.languageId === id),
    // );

    // const matchingEducation = userEducation.some(
    //   (edu) => edu.education === jobRequiredEducations,
    // );

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    return new ApiSuccessResponse(true, 'Job post found', {
      jobPost,
    });
  }

  async getJobStatusTotal() {
    const [totalApplicants, totalActives, totalPendings, totalFullfields] =
      await Promise.all([
        this.prismaService.jobApplication.count(),
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

      // if (query.job_profile?.length) {
      //   where.jobBasicInfo = {
      //     skillIds:{
      //       hasSome: query.skillIds
      //     }
      //   };
      // }

      if (query.search) {
        where.jobBasicInfo.title = {
          contains: query.search,
          mode: 'insensitive',
        };
      }

      if (query.job_type?.length) {
        where.jobBasicInfo.jobType = {
          equals: query.job_type,
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

        where.jobBasicInfo = salaryFilter;
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
    if (query.skillIds) {
      where.jobQualification = {
        skillIds: {
          hasSome: query?.skillIds?.split('_'),
        },
      };
    }

    if (query.locations && query.locations.length > 0) {
      where.venue = {
        venueBasicDetails: {
          city: { in: query?.locations?.split('_') },
        },
      };
    }

    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);
    const sortOrder = getSortOrder(query.order);
    const orderBy = getSortBy(query.sort);
    const currentDate = new Date().toISOString();
    const [totalOpenJobs, totalFulfilledJobs] = await Promise.all([
      this.prismaService.jobPost.count({
        where: {
          isOpen: true,
          jobBasicInfo: {
            deadline: {
              gte: currentDate,
            },
          },
        },
      }),
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
          saveJobPosts: {
            where: {
              userId: user.id,
            },
          },
        },
        skip,
        take,
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prismaService.jobPost.count({}),
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

  async findAllForApplicant(query: QueryJobPostDto, user?: Auth) {
    const experienceOrder = [
      'FRESHER',
      'ONE_YEAR',
      'TWO_YEAR',
      'THREE_YEAR',
      'FOUR_YEAR',
      'FIVE_PLUS_YEAR',
    ] as const;

    const where: Prisma.JobPostWhereInput = {
      jobBasicInfo: {
        deadline: {
          gt: new Date().toISOString(),
        },
      },
    };

    const include: Prisma.JobPostInclude = {
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
          logo: true,
          venueBasicDetails: {
            include: {
              files: true,
            },
          },
        },
      },
    };

    if (user) {
      include.jobApplications = {
        where: {
          userId: user.id,
        },
      };
      include.saveJobPosts = {
        where: {
          userId: user.id,
        },
      };
    }

    if (
      query.skillIds ||
      query.search ||
      query.job_type ||
      query.minSalary ||
      query.maxSalary
    ) {
      if (query.skillIds?.length) {
        where.jobBasicInfo = {
          profileId: {
            in: query.skillIds?.split('_'),
          },
        };
      }

      if (query.search) {
        where.jobBasicInfo.title = {
          contains: query.search,
          mode: 'insensitive',
        };
      }
      if (query.job_type) {
        where.jobBasicInfo.jobType = { equals: query.job_type };
      }

      if (query.minSalary || query.maxSalary) {
        const salaryFilter: any = {};
        if (query.minSalary && query.maxSalary) {
          salaryFilter.start = { gte: parseInt(query.minSalary) };
        }

        if (query.maxSalary) {
          salaryFilter.end = { lte: parseInt(query.maxSalary) };
        }

        where.jobBasicInfo.start = salaryFilter.start;
        where.jobBasicInfo.end = salaryFilter.end;
      }
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.countryId) {
      where.countryId = query.countryId;
    }

    if (query.experience) {
      const experienceIndex = experienceOrder.indexOf(query.experience);
      if (experienceIndex !== -1) {
        where.jobQualification = {
          minExperience: {
            in: experienceOrder.slice(0, experienceIndex + 1),
          },
        };
      }
    }

    if (query.locations && query.locations.length > 0) {
      where.venue = {
        venueBasicDetails: {
          city: { in: query?.locations?.split('_') },
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
        include,
        skip,
        take,
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prismaService.jobPost.count({ where }),
    ]);

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
    const jobPostWithCounts = jobPost.map((job: any) => ({
      ...job,
      totalApplicants: job?.jobApplications?.length,
      totalSaved: job?.saveJobPosts?.length,
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
    const [expiringJobs, total] = await Promise.all([
      this.prismaService.jobPost.findMany({
        where: {
          userId: user.id,
          jobBasicInfo: {
            deadline: {
              gte: today,
              lte: nextWeek,
            },
          },
        },
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
        include: {
          jobBasicInfo: true,
        },
      }),
      this.prismaService.jobPost.count({
        where: {
          userId: user.id,
          jobBasicInfo: {
            deadline: {
              gte: today,
              lte: nextWeek,
            },
          },
        },
      }),
    ]);

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
          jobId: updateJobPost.id,
        },
      });
    } else if (body.status == 'Rejected') {
      await this.prismaService.activity.create({
        data: {
          userId: user.id,
          type: 'REJECT_JOB',
          jobId: updateJobPost.id,
        },
      });
    }
    return new ApiSuccessResponse(
      true,
      'Job Status Updated Successfully',
      updateJobPost,
    );
  }

  async findAllForAdmin(query: QueryJobPostDtoForAdmin) {
    const where: Prisma.JobPostWhereInput = {};
    if (query.partnerId) {
      where.userId = query.partnerId;
    }

    if (query.job_profile || query.search || query.job_type) {
      where.jobBasicInfo = {};

      if (query.job_profile?.length) {
        where.jobBasicInfo = {
          profileId: {
            in: query.skillIds,
          },
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
              // profile: {
              // select: {
              // name: true,
              // file: {
              //   select: {
              //     url: true,
              //   },
              // },
              // },
              // },
              venue: {
                include: {
                  logo: true,
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
          _count: {
            select: {
              saveJobPosts: true,
            },
          },
        },

        skip,
        take,
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prismaService.jobPost.count({ where }),
    ]);

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
    const jobPostWithCounts = jobPost.map((job: any) => ({
      ...job,
      totalApplicants: job.jobApplications.length,
      totalSaved: job._count,
    }));
    return new ApiSuccessResponse(true, 'Job post found', {
      total,
      totalOpenJobs,
      totalFulfilledJobs,
      totalPendingJobs,
      jobPosts: jobPostWithCounts,
    });
  }

  async findAllForAgency(query: QueryJobPostDto, user: Auth) {
    const where: Prisma.JobPostWhereInput = {};
    if (query.partnerId) {
      where.userId = query.partnerId;
    }

    if (query.job_profile || query.search || query.job_type) {
      where.jobBasicInfo = {};

      if (query.job_profile?.length) {
        where.jobBasicInfo = {
          profileId: {
            in: query.skillIds.split('_'),
          },
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
          equals: query.job_type,
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

        where.jobBasicInfo = salaryFilter;
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
          city: { in: query?.locations?.split('_') },
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
          jobBasicInfo: true,
          venue: {
            include: {
              logo: true,
              venueBasicDetails: {
                include: {
                  files: true,
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
          saveJobPosts: {
            where: {
              userId: user.id,
            },
          },
        },

        skip,
        take,
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prismaService.jobPost.count({ where }),
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
