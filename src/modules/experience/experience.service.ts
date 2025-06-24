import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth, Prisma } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { QueryExperienceDto } from './dto/query-experience.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';
import { use } from 'passport';

@Injectable()
export class ExperienceService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(body: CreateExperienceDto, user: Auth) {
    console.log('body ', body);
    console.log('userId ', user.id);
    const isExists = await this.prismaService.experience.findFirst({
      where: {
        userId: user?.id,
        isFresher: true,
      },
    });
    console.log('isExists ', isExists);
    if (isExists) {
      console.log('console.log(is exists) runnning');
      const data = await this.prismaService.experience.deleteMany({
        where: {
          userId: user?.id,
          isFresher: true,
        },
      });
      console.log('d ', data);
    }
    const experience = await this.prismaService.experience.create({
      data: {
        userId: user.id,
        profileId: body.profileId,
        location: body.location,
        longitude: body.longitude,
        latitude: body.latitude,
        startDate: body.startDate
          ? new Date(body?.startDate)?.toISOString()
          : null,
        endDate: body.endDate ? new Date(body?.endDate)?.toISOString() : null,
        description: body.description,
        isFresher: body.isFresher,
      },
    });
    console.log('Experience ', experience);

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
      include: {
        profile: true,
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
        profileId: body.profileId,
        location: body.location,
        description: body.description,
        longitude: body.longitude,
        latitude: body.latitude,
        startDate: new Date(body.startDate).toISOString(),
        endDate: new Date(body.endDate).toISOString(),
        isFresher: body.isFresher,
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
