import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth, Prisma } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { QueryExperienceDto } from './dto/query-experience.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';

@Injectable()
export class ExperienceService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(body: CreateExperienceDto, user: Auth) {
    const experience = await this.prismaService.experience.create({
      data: {
        userId: user.id,
        profile: body.profile,
        location: body.location,
        longitude: body.longitude,
        latitude: body.latitude,
        startDate: new Date(body.startDate).toISOString(),
        endDate: new Date(body.endDate).toISOString(),
        description: body.description,
      },
    });

    return new ApiSuccessResponse(true, 'experience added', experience);
  }

  async findAll(user: Auth) {
    const experiences = await this.prismaService.experience.findMany({
      where: {
        userId: user.id,
      },
    });
    if (!experiences) {
      throw new NotFoundException('experience not found');
    }
    return new ApiSuccessResponse(true, 'experiences data ', { experiences });
  }

  async findOne(id: string) {
    const experience = await this.prismaService.experience.findUnique({
      where: {
        id,
      },
    });
    if (!experience) {
      throw new NotFoundException('experience not found');
    }
    return new ApiSuccessResponse(true, 'experience data', experience);
  }
  async findOneForAdmin(query: QueryExperienceDto) {
    const where: Prisma.ExperienceWhereInput = {};
    if (query.userId) {
      where.userId = query.userId;
    }
    const experience = await this.prismaService.experience.findMany({
      where,
      skip: getPaginationSkip(query.page, query.limit),
      take: getPaginationTake(query.limit),
    });
    if (!experience) {
      throw new NotFoundException('experience not found');
    }
    return new ApiSuccessResponse(true, 'experience data', { experience });
  }

  async update(id: string, body: UpdateExperienceDto, user: Auth) {
    const existingExperience = await this.prismaService.experience.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingExperience) {
      throw new NotFoundException('experience not found');
    }
    const updatedExperience = await this.prismaService.experience.update({
      where: {
        id: existingExperience.id,
      },
      data: {
        profile: body.profile,
        location: body.location,
        longitude: body.longitude,
        latitude: body.latitude,
        startDate: new Date(body.startDate).toISOString(),
        endDate: new Date(body.endDate).toISOString(),
      },
    });
    return new ApiSuccessResponse(
      true,
      'experience updated',
      updatedExperience,
    );
  }

  async remove(id: string, user: Auth) {
    const existingExperience = await this.prismaService.experience.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingExperience) {
      throw new NotFoundException('experience not found');
    }
    const updatedExperience = await this.prismaService.experience.delete({
      where: {
        id: existingExperience.id,
      },
    });
    return new ApiSuccessResponse(true, 'experience deleted', null);
  }
}
