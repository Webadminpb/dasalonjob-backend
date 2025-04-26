import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSavedApplicantDto,
  UpdateSavedApplicantDto,
} from './dto/create-saved-applicant.dto';
import { Auth, Prisma } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { QuerySavedApplicant } from './dto/query-saved-applicant.dto';
import {
  getPaginationSkip,
  getPaginationTake,
  getSortBy,
  getSortOrder,
} from 'src/common/utils/common';

@Injectable()
export class SavedApplicantService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSavedApplicant(body: CreateSavedApplicantDto, user: Auth) {
    const existingSavedApplicant =
      await this.prismaService.savedApplicant.findUnique({
        where: {
          agencyId_applicantId_unique: {
            agencyId: user.id,
            applicantId: body.applicantId,
          },
        },
      });

    if (existingSavedApplicant) {
      throw new ConflictException('Saved Applicant Already Existed');
    }

    const newSavedApplicant = await this.prismaService.savedApplicant.create({
      data: {
        categoryId: body.categoryId,
        agencyId: user.id,
        applicantId: body.applicantId,
      },
    });

    return new ApiSuccessResponse(
      true,
      'Saved Applicant Created Successfully',
      newSavedApplicant,
    );
  }

  async getSavedApplicants(query: QuerySavedApplicant, user: Auth) {
    const where: Prisma.SavedApplicantWhereInput = {};
    if (user?.id) {
      where.agencyId = user.id;
    }

    if (query?.categoryId) {
      where.categoryId = query?.categoryId;
    }

    if (query?.search) {
      where.OR = [
        {
          applicant: {
            firstName: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
        {
          applicant: {
            lastName: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }
    let jobPost: any;
    if (query?.jobPostId) {
      jobPost = await this.prismaService.jobPost.findUnique({
        where: { id: query?.jobPostId },
        include: {
          jobQualification: {
            include: {
              skills: true,
            },
          },
        },
      });
    }
    const jobRequiredSkillIds =
      jobPost?.jobQualification?.skills.map((skill) => skill.id) || [];
    const orderBy = getSortOrder(query.order);
    const sortBy = getSortBy(query.sort);

    const [savedApplicants, total] = await Promise.all([
      this.prismaService.savedApplicant.findMany({
        where,
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
        // orderBy: {
        //   [orderBy]: [sortBy],
        // },
        include: {
          applicant: {
            include: {
              profileImage: true,
              jobPreference: {
                include: {
                  skills: true,
                },
              },
            },
          },
        },
      }),
      this.prismaService.savedApplicant.count({ where }),
    ]);

    const savedApplicantsWithMatchCount = savedApplicants.map((applicant) => {
      const applicantSkills = applicant.applicant.jobPreference?.skills || [];
      const applicantSkillIds = applicantSkills.map((skill) => skill.id);

      const matchingSkillsCount = jobRequiredSkillIds.filter((skillId: any) =>
        applicantSkillIds.includes(skillId),
      ).length;

      return {
        ...applicant,
        skillsMatchCount: matchingSkillsCount,
        totalRequiredSkills: jobRequiredSkillIds.length,
      };
    });

    savedApplicantsWithMatchCount.sort(
      (a, b) => b.skillsMatchCount - a.skillsMatchCount,
    );

    return new ApiSuccessResponse(true, 'Saved Applicant Data', {
      savedApplicants: savedApplicantsWithMatchCount,
      total,
    });
  }

  async getSavedApplicant(id: string) {
    const savedApplicant = await this.prismaService.savedApplicant.findUnique({
      where: {
        id,
      },
    });
    if (!savedApplicant)
      throw new NotFoundException('Saved Applicant Not Found');

    return new ApiSuccessResponse(
      true,
      'Saved Applicant Found',
      savedApplicant,
    );
  }

  async updateSavedApplicant(
    id: string,
    body: UpdateSavedApplicantDto,
    user: Auth,
  ) {
    const existingSavedApplicant =
      await this.prismaService.savedApplicant.findUnique({
        where: {
          id,
          agencyId: user.id,
        },
      });
    if (!existingSavedApplicant)
      throw new NotFoundException('Saved Applicant Not Found');

    const updatedSavedApplicant =
      await this.prismaService.savedApplicant.update({
        where: {
          id,
        },
        data: {
          agencyId: user.id,
          applicantId: body.applicantId,
        },
      });

    return new ApiSuccessResponse(
      true,
      'Saved Applicant Updated Successfully',
      updatedSavedApplicant,
    );
  }

  async deleteSavedApplicant(id: string, user: Auth) {
    const existingSavedApplicant =
      await this.prismaService.savedApplicant.findUnique({
        where: {
          id,
          agencyId: user.id,
        },
      });

    if (!existingSavedApplicant)
      throw new NotFoundException('Saved Applicant Not Found');

    await this.prismaService.savedApplicant.delete({
      where: {
        id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Saved Applicant Deleted Successfully',
      null,
    );
  }
}
