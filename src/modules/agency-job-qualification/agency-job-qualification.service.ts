import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth, HighestEducation } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateAgencyJobQualificationDto } from './dto/create-agency-job-qualification.dto';
import { UpdateAgencyJobQualificationDto } from './dto/update-agency-job-qualification.dto';

@Injectable()
export class AgencyJobQualificationService {
  constructor(private readonly prismaService: PrismaService) {}

  // Create a new job qualification
  async create(body: CreateAgencyJobQualificationDto, user: Auth) {
    const agencyJobQualification =
      await this.prismaService.agencyJobQualification.create({
        data: {
          userId: user.id,
          education: body.education,
          minExperience: body.minExperience,
          certification: body.certification,
          isProfessional: body.isProfessional,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Agency job qualification added',
      agencyJobQualification,
    );
  }

  // Find all job qualifications for the current user
  async findMyAgencyJobQualifications(user: Auth) {
    const agencyJobQualifications =
      await this.prismaService.agencyJobQualification.findUnique({
        where: { userId: user.id },
      });
    if (!agencyJobQualifications) {
      throw new NotFoundException('Agency job qualifications not found');
    }
    return new ApiSuccessResponse(
      true,
      'Agency job qualifications found',
      agencyJobQualifications,
    );
  }

  // Update a job qualification by ID
  async update(user: Auth, body: UpdateAgencyJobQualificationDto) {
    const existingQualification =
      await this.prismaService.agencyJobQualification.findUnique({
        where: { userId: user.id },
      });
    if (!existingQualification) {
      throw new NotFoundException('Agency job qualification not found');
    }
    const updatedQualification =
      await this.prismaService.agencyJobQualification.update({
        where: { id: existingQualification.id },
        data: { ...body },
      });
    return new ApiSuccessResponse(
      true,
      'Agency job qualification updated',
      updatedQualification,
    );
  }

  // Delete a job qualification by ID
  async remove(user: Auth) {
    const existingQualification =
      await this.prismaService.agencyJobQualification.findUnique({
        where: { userId: user.id },
      });
    if (!existingQualification) {
      throw new NotFoundException('Agency job qualification not found');
    }
    await this.prismaService.agencyJobQualification.delete({
      where: { id: existingQualification.id },
    });
    return new ApiSuccessResponse(
      true,
      'Agency job qualification deleted',
      null,
    );
  }
}
