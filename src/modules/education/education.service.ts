import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(body: CreateEducationDto, user: Auth) {
    const education = await this.prismaService.education.create({
      data: {
        education: body.education,
        school: body.school,
        attended: body.attended,
        graduated: body.graduated,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(true, 'education added', education);
  }

  async findMyAllEducation(user: Auth) {
    const educations = await this.prismaService.education.findMany({
      where: {
        userId: user.id,
      },
    });
    if (!educations) {
      throw new NotFoundException('educations not found');
    }
    return new ApiSuccessResponse(true, 'educations data', { educations });
  }

  findOne(id: string) {
    const education = this.prismaService.education.findUnique({
      where: {
        id,
      },
    });
    if (!education) {
      throw new NotFoundException('education not found');
    }
    return new ApiSuccessResponse(true, 'education data', education);
  }

  async update(id: string, body: UpdateEducationDto, user: Auth) {
    const existingEducation = this.prismaService.education.findUnique({
      where: {
        userId: user.id,
        id,
      },
    });
    if (!existingEducation) {
      throw new NotFoundException('education not found');
    }
    const updatedEducation = await this.prismaService.education.update({
      where: {
        id: id,
      },
      data: { ...body },
    });
    return new ApiSuccessResponse(true, 'eduction updated ', updatedEducation);
  }

  async remove(id: string, user: Auth) {
    const existingEducation = this.prismaService.education.findUnique({
      where: {
        userId: user.id,
        id,
      },
    });
    if (!existingEducation) {
      throw new NotFoundException('education not found');
    }
    await this.prismaService.education.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(true, 'eduction deleted', null);
  }
}
