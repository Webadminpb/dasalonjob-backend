import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { CreateJobDescriptionDto } from './dto/create-jobdescription.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { UpdateJobDescriptionDto } from './dto/update-jobdescription.dto';

@Injectable()
export class JobDescriptionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateJobDescriptionDto, user: Auth) {
    const jobDescription = await this.prismaService.jobDescription.create({
      data: {
        description: body.description,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Job description added',
      jobDescription,
    );
  }

  async findMyJobDescription(user: Auth) {
    const jobDescription = await this.prismaService.jobDescription.findMany({
      where: { userId: user.id },
    });
    if (!jobDescription) {
      throw new NotFoundException('Job description not found');
    }
    return new ApiSuccessResponse(true, 'Job description found', {
      jobDescription,
    });
  }

  async update(id: string, user: Auth, body: UpdateJobDescriptionDto) {
    const existingJobDescription =
      await this.prismaService.jobDescription.findUnique({
        where: { userId: user.id, id },
      });
    if (!existingJobDescription) {
      throw new NotFoundException('Job description not found');
    }
    const updatedJobDescription =
      await this.prismaService.jobDescription.update({
        where: { id: existingJobDescription.id },
        data: {
          description: body.description,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Job description updated',
      updatedJobDescription,
    );
  }

  async remove(id: string, user: Auth) {
    const existingJobDescription =
      await this.prismaService.jobDescription.findUnique({
        where: { userId: user.id, id },
      });
    if (!existingJobDescription) {
      throw new NotFoundException('Job description not found');
    }
    await this.prismaService.jobDescription.delete({
      where: { id: existingJobDescription.id },
    });
    return new ApiSuccessResponse(true, 'Job description deleted', null);
  }
}
