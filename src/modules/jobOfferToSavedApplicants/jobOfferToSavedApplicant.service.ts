import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth, Prisma } from '@prisma/client';
import {
  CreateJobOfferToSavedApplicantDto,
  UpdateJobOfferToSavedApplicantDto,
} from './dto/create-jobOfferToSavedApplicant.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { QueryJobOfferToSavedApplicantDto } from './dto/query-jobOfferToSavedApplicant.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';

@Injectable()
export class JobOfferToSavedApplicantService {
  constructor(private readonly prismaService: PrismaService) {}

  // Create Job Offer
  async createJobOffer(user: Auth, body: CreateJobOfferToSavedApplicantDto) {
    await this.checkExistingJobOffer(user.id, body.applicantId, body.jobPostId);

    const jobOffer = await this.prismaService.jobOfferToSavedApplicant.create({
      data: {
        agencyId: user.id,
        applicantId: body.applicantId,
        jobPostId: body.jobPostId,
      },
    });

    return new ApiSuccessResponse(
      true,
      'Job Offer Created Successfully',
      jobOffer,
    );
  }

  // find One Job Offer
  async getJobOffer(id: string) {
    const jobOffer = await this.findJobOfferById(id);
    return new ApiSuccessResponse(true, 'Job Offer Found', jobOffer);
  }

  async getJobOffersForApplicant(
    query: QueryJobOfferToSavedApplicantDto,
    user: Auth,
  ) {
    const where: Prisma.JobOfferToSavedApplicantWhereInput = {
      applicantId: user.id,
    };
    if (query.status) {
      where.status = query.status;
    }
    const [jobOffers, total] = await Promise.all([
      this.prismaService.jobOfferToSavedApplicant.findMany({
        where,
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
      }),
      this.prismaService.jobOfferToSavedApplicant.count({ where }),
    ]);
    return new ApiSuccessResponse(true, 'Job Offers', { jobOffers, total });
  }

  // Update Job Offer
  async updateJobOfferStatus(
    id: string,
    body: UpdateJobOfferToSavedApplicantDto,
  ) {
    await this.findJobOfferById(id);

    await this.prismaService.jobOfferToSavedApplicant.update({
      where: { id },
      data: body,
    });

    return new ApiSuccessResponse(
      true,
      'Job Offer Status Updated Successfully',
      null,
    );
  }

  async deleteJobOffer(id: string) {
    await this.findJobOfferById(id);

    await this.prismaService.jobOfferToSavedApplicant.delete({
      where: { id },
    });

    return new ApiSuccessResponse(true, 'Job Offer Deleted Successfully', null);
  }

  // Private reusable methods
  private async findJobOfferById(id: string) {
    const jobOffer =
      await this.prismaService.jobOfferToSavedApplicant.findUnique({
        where: { id },
      });
    if (!jobOffer) throw new NotFoundException('Job Offer Not Found');
    return jobOffer;
  }

  private async checkExistingJobOffer(
    agencyId: string,
    applicantId: string,
    jobPostId: string,
  ) {
    const existingOffer =
      await this.prismaService.jobOfferToSavedApplicant.findUnique({
        where: {
          agency_applicant_job_unique: {
            applicantId,
            agencyId,
            jobPostId,
          },
        },
      });
    if (existingOffer)
      throw new BadRequestException('Job Offer Already Exists');
  }
}
