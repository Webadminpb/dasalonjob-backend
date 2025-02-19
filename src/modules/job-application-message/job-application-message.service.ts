import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobApplicationMessageDto } from './dto/create-job-application-message.dto';
import { UpdateJobApplicationMessageDto } from './dto/update-job-application-message.dto';

@Injectable()
export class JobApplicationMessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateJobApplicationMessageDto, user: Auth) {
    const jobApplicationMessage =
      await this.prismaService.jobApplicationMessage.create({
        data: {
          applicantId: body.applicantId,
          partnerId: user.id,
          jobApplicationId: body.jobApplicationId,
          message: body.message,
        },
      });

    return new ApiSuccessResponse(
      true,
      'Job application message created',
      jobApplicationMessage,
    );
  }

  async findAll(user: Auth) {
    const jobApplicationMessages =
      await this.prismaService.jobApplicationMessage.findMany({
        where: {
          OR: [{ applicantId: user.id }, { partnerId: user.id }],
        },
      });
    if (!jobApplicationMessages) {
      throw new NotFoundException('Job application messages not found');
    }
    return new ApiSuccessResponse(true, 'Job application messages data', {
      jobApplicationMessages,
    });
  }

  async findJobApplicationMessage(id: string, user: Auth) {
    const jobApplicationMessages =
      await this.prismaService.jobApplicationMessage.findMany({
        where: {
          OR: [{ applicantId: user.id }, { partnerId: user.id }],
          jobApplicationId: id,
        },
      });
    if (!jobApplicationMessages) {
      throw new NotFoundException('Job application messages not found');
    }
    return new ApiSuccessResponse(true, 'Job application messages data', {
      jobApplicationMessages,
    });
  }

  async findOne(id: string) {
    const jobApplicationMessage =
      await this.prismaService.jobApplicationMessage.findUnique({
        where: {
          id,
        },
      });
    if (!jobApplicationMessage) {
      throw new NotFoundException('Job application message not found');
    }
    return new ApiSuccessResponse(
      true,
      'Job application message data',
      jobApplicationMessage,
    );
  }

  async update(id: string, body: UpdateJobApplicationMessageDto, user: Auth) {
    const existingJobApplicationMessage =
      await this.prismaService.jobApplicationMessage.findUnique({
        where: {
          id,
          OR: [{ applicantId: user.id }, { partnerId: user.id }],
        },
      });
    if (!existingJobApplicationMessage) {
      throw new NotFoundException('Job application message not found');
    }
    const updatedJobApplicationMessage =
      await this.prismaService.jobApplicationMessage.update({
        where: {
          id: existingJobApplicationMessage.id,
        },
        data: {
          ...body,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Job application message updated',
      updatedJobApplicationMessage,
    );
  }

  async remove(id: string, user: Auth) {
    const existingJobApplicationMessage =
      await this.prismaService.jobApplicationMessage.findUnique({
        where: {
          id,
          OR: [{ applicantId: user.id }, { partnerId: user.id }],
        },
      });
    if (!existingJobApplicationMessage) {
      throw new NotFoundException('Job application message not found');
    }
    const updatedJobApplicationMessage =
      await this.prismaService.jobApplicationMessage.delete({
        where: {
          id: existingJobApplicationMessage.id,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Job application message deleted',
      null,
    );
  }
}
