import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth, Prisma } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateFeaturedJobDto } from './dto/create-featured-job.dto';
import { UpdateFeaturedJobDto } from './dto/update-featured-job.dto';
import { QueryFeaturedJobDto } from './dto/query-featured-job.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';

@Injectable()
export class FeaturedJobService {
  constructor(private prismaService: PrismaService) {}

  async create(body: CreateFeaturedJobDto, user: Auth) {
    const featuredJob = await this.prismaService.featuredJob.create({
      data: {
        jobPostId: body.jobPostId,
        endDate: body.endDate,
        priority: body.priority || 1,
      },
      include: {
        jobPost: true,
      },
    });

    return new ApiSuccessResponse(
      true,
      'Job successfully featured',
      featuredJob,
    );
  }

  async findAll(query: QueryFeaturedJobDto) {
    const where = this.buildFeaturedJobWhereClause(query);
    const [featuredJobs, total] = await Promise.all([
      this.prismaService.featuredJob.findMany({
        where,
        include: {
          jobPost: true,
        },
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
        orderBy: this.builderFeaturedJobOrderBy(query.sort),
      }),
      this.prismaService.featuredJob.count({ where }),
    ]);

    return new ApiSuccessResponse(true, 'Featured jobs retrieved', {
      featuredJobs,
      total,
    });
  }

  async findOne(id: string) {
    const featuredJob = await this.prismaService.featuredJob.findUnique({
      where: { id },
      include: {
        jobPost: true,
      },
    });

    if (!featuredJob) {
      throw new NotFoundException('Featured job not found');
    }

    return new ApiSuccessResponse(true, 'Featured job retrieved', featuredJob);
  }

  async update(id: string, body: UpdateFeaturedJobDto, user: Auth) {
    const existing = await this.prismaService.featuredJob.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Featured job not found');
    }

    const updatedFeaturedJob = await this.prismaService.featuredJob.update({
      where: { id },
      data: {
        ...body,
        endDate: body.endDate ? body.endDate : undefined,
      },
      include: {
        jobPost: true,
      },
    });

    return new ApiSuccessResponse(
      true,
      'Featured job updated',
      updatedFeaturedJob,
    );
  }

  async remove(id: string) {
    const existing = await this.prismaService.featuredJob.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Featured job not found');
    }

    await this.prismaService.featuredJob.delete({
      where: { id },
    });

    return new ApiSuccessResponse(true, 'Featured job removed', null);
  }

  async recordImpression(id: string) {
    await this.prismaService.featuredJob.update({
      where: { id },
      data: {
        impressions: { increment: 1 },
      },
    });

    return new ApiSuccessResponse(true, 'Impression recorded', null);
  }

  async recordClick(id: string) {
    await this.prismaService.featuredJob.update({
      where: { id },
      data: {
        clicks: { increment: 1 },
      },
    });

    return new ApiSuccessResponse(true, 'Click recorded', null);
  }

  private buildFeaturedJobWhereClause(
    query: QueryFeaturedJobDto,
  ): Prisma.FeaturedJobWhereInput {
    const where: Prisma.FeaturedJobWhereInput = {};

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.jobPostId) {
      where.jobPostId = query.jobPostId;
    }

    if (query.isActive === true) {
      const now = new Date().toISOString();
      where.isActive = true;
      where.startDate = { lte: now } as Prisma.DateTimeFilter;
      where.endDate = { gte: now } as Prisma.DateTimeFilter;
    }

    return where;
  }

  private builderFeaturedJobOrderBy(
    sort?: string,
  ): Prisma.FeaturedJobOrderByWithRelationInput {
    if (!sort) return { priority: 'desc' };

    const [field, order] = sort.split(':');
    const validFields = [
      'priority',
      'createdAt',
      'endDate',
      'impressions',
      'clicks',
    ];
    const validOrders = ['asc', 'desc'];

    if (validFields.includes(field) && validOrders.includes(order)) {
      return {
        [field]: order as 'asc' | 'desc',
      };
    }

    return { priority: 'desc' };
  }
}
