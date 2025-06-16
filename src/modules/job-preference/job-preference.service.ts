import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobpreferenceDto } from './dto/create-jobpreference.dto';
import { UpdateJobpreferenceDto } from './dto/update-jobpreference.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';

@Injectable()
export class JobpreferenceService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateJobpreferenceDto, user: Auth) {
    const jobPreference = await this.prismaService.jobPreference.create({
      data: {
        userId: user.id,
        joining: body.joining,
        locations: body.locations,
        salary: body.salary,
        skillsIds: body.skillsIds,
      },
    });
    return new ApiSuccessResponse(true, 'job preference added', jobPreference);
  }

  async findMyJobPreference(user: Auth) {
    const jobPreference = await this.prismaService.jobPreference.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!jobPreference) {
      throw new NotFoundException('Job preference not found');
    }
    return new ApiSuccessResponse(true, 'job preference data ', jobPreference);
  }

  async update(body: UpdateJobpreferenceDto, user: Auth) {
    const existingJobPreference =
      await this.prismaService.jobPreference.findUnique({
        where: {
          userId: user.id,
        },
      });
    if (!existingJobPreference) {
      throw new NotFoundException('Job Preference Not Found');
    }
    const updatedJobPreference = await this.prismaService.jobPreference.update({
      where: {
        id: existingJobPreference.id,
      },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(
      true,
      'job preference updated ',
      updatedJobPreference,
    );
  }

  async remove(user: Auth) {
    const existingJobPreference =
      await this.prismaService.jobPreference.findUnique({
        where: {
          userId: user.id,
        },
      });
    if (!existingJobPreference) {
      throw new NotFoundException('Job Preference Updated');
    }
    await this.prismaService.jobPreference.delete({
      where: {
        id: existingJobPreference.id,
      },
    });
    return new ApiSuccessResponse(true, 'job preference deleted ', null);
  }
}
