import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSponsoredJobDto } from './dto/create-sponsored-job.dto';
import { UpdateSponsoredJobDto } from './dto/update-sponsored-job.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { QuerySponsoredJobDto } from './dto/query-sponsored-job.dto';
import { Prisma } from '@prisma/client';
import {
  getPaginationSkip,
  getPaginationTake,
  getSortBy,
  getSortOrder,
} from 'src/common/utils/common';

@Injectable()
export class SponsoredJobService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSponsoredjob(body: CreateSponsoredJobDto) {
    const { jobPostId, startDate, endDate, priority, isActive } = body;

    const sponsoredJob = await this.prismaService.sponsoredJob.create({
      data: {
        jobPostId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        priority,
        isActive: isActive || false,
      },
    });

    return new ApiSuccessResponse(
      true,
      'Sponsored Job Created Successfully',
      sponsoredJob,
    );
  }

  async updateSponsoredJob(id: string, body: UpdateSponsoredJobDto) {
    const existingSponsoredJob =
      await this.prismaService.sponsoredJob.findUnique({
        where: {
          id,
        },
      });

    if (!existingSponsoredJob) {
      throw new NotFoundException('Sponsored Job not found');
    }

    const updatedSponsoredJob = await this.prismaService.sponsoredJob.update({
      where: {
        id,
      },
      data: {
        ...body,
        startDate:
          body.startDate?.toISOString() || existingSponsoredJob.startDate,
        endDate: body.endDate?.toISOString() || existingSponsoredJob.endDate,
      },
    });

    return new ApiSuccessResponse(
      true,
      'Sponsored Job Updated Successfully',
      updatedSponsoredJob,
    );
  }

  async getSponsoredJobs(query: QuerySponsoredJobDto) {
    const where: Prisma.SponsoredJobWhereInput = {};

    const orderBy = getSortOrder(query.order);
    const sortBy = getSortBy(query.sort);

    const [sponsoredJobs, total] = await Promise.all([
      this.prismaService.sponsoredJob.findMany({
        include: {
          job: true,
        },
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
        orderBy: {
          [sortBy]: [orderBy],
        },
      }),
      this.prismaService.sponsoredJob.count(),
    ]);
    if (!sponsoredJobs) {
      throw new NotFoundException('Sponsored Jobs not found');
    }
    return new ApiSuccessResponse(true, 'Sponsored Jobs Found', {
      sponsoredJobs,
      total,
    });
  }

  async getSponsoredJobById(id: string) {
    const sponsoredJob = await this.prismaService.sponsoredJob.findUnique({
      where: {
        id,
      },
      include: {
        job: true,
      },
    });
    if (!sponsoredJob) {
      throw new NotFoundException('Sponsored Job not found');
    }
    return new ApiSuccessResponse(true, 'Sponsored job Found', sponsoredJob);
  }

  async deleteSponsoredJobById(id: string) {
    const existingSponsoredjob =
      await this.prismaService.sponsoredJob.findUnique({
        where: {
          id,
        },
      });

    if (!existingSponsoredjob) {
      throw new NotFoundException('Sponsored job not found');
    }

    await this.prismaService.sponsoredJob.delete({
      where: {
        id,
      },
    });

    return new ApiSuccessResponse(
      true,
      'Sponsored job deleted successfully',
      null,
    );
  }
}
