import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobApplicationMessageDto } from './dto/create-job-application-message.dto';
import { UpdateJobApplicationMessageDto } from './dto/update-job-application-message.dto';

@Injectable()
export class JobApplicationMessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMessageFromPartnerSide(
    body: CreateJobApplicationMessageDto,
    user: Auth,
  ) {
    const jobApplicationMessage =
      await this.prismaService.jobApplicationPartnerMessage.create({
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

  async createMessageFromApplicantSide(
    body: CreateJobApplicationMessageDto,
    user: Auth,
  ) {
    const jobApplicationMessage =
      await this.prismaService.jobApplicationApplicantMessage.create({
        data: {
          applicantId: user.id,
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

  async findOnePartnerMessage(id: string) {
    const jobApplicationMessage =
      await this.prismaService.jobApplicationPartnerMessage.findUnique({
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
  async findOneApplicantMessage(id: string) {
    const jobApplicationMessage =
      await this.prismaService.jobApplicationApplicantMessage.findUnique({
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

  async updatePartnerMessage(
    id: string,
    body: UpdateJobApplicationMessageDto,
    user: Auth,
  ) {
    const existingJobApplicationMessage =
      await this.prismaService.jobApplicationPartnerMessage.findUnique({
        where: {
          id,
          OR: [{ applicantId: user.id }, { partnerId: user.id }],
        },
      });
    if (!existingJobApplicationMessage) {
      throw new NotFoundException('Job application message not found');
    }
    const updatedJobApplicationMessage =
      await this.prismaService.jobApplicationPartnerMessage.update({
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

  async updateApplicantMessage(
    id: string,
    body: UpdateJobApplicationMessageDto,
    user: Auth,
  ) {
    const existingJobApplicationMessage =
      await this.prismaService.jobApplicationApplicantMessage.findUnique({
        where: {
          id,
          OR: [{ applicantId: user.id }],
        },
      });
    if (!existingJobApplicationMessage) {
      throw new NotFoundException('Job application message not found');
    }
    const updatedJobApplicationMessage =
      await this.prismaService.jobApplicationApplicantMessage.update({
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

  async removePartnerMessage(id: string, user: Auth) {
    const existingJobApplicationMessage =
      await this.prismaService.jobApplicationPartnerMessage.findUnique({
        where: {
          id,
          OR: [{ applicantId: user.id }, { partnerId: user.id }],
        },
      });
    if (!existingJobApplicationMessage) {
      throw new NotFoundException('Job application message not found');
    }
    const updatedJobApplicationMessage =
      await this.prismaService.jobApplicationPartnerMessage.delete({
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

  async removeApplicantMessage(id: string, user: Auth) {
    const existingJobApplicationMessage =
      await this.prismaService.jobApplicationApplicantMessage.findUnique({
        where: {
          id,
          OR: [{ applicantId: user.id }],
        },
      });
    if (!existingJobApplicationMessage) {
      throw new NotFoundException('Job application message not found');
    }
    const updatedJobApplicationMessage =
      await this.prismaService.jobApplicationApplicantMessage.delete({
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
