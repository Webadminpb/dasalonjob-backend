import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseAcademyDto } from './dto/create-course-academy.dto';
import { UpdateCourseAcademyDto } from './dto/update-course-academy.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { Auth } from '@prisma/client';

@Injectable()
export class CourseAcademyService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateCourseAcademyDto, user: Auth) {
    if (user.role == 'ADMIN' || user.role == 'SUPER_ADMIN') {
      const courseAcademy = await this.prismaService.courseAcademy.create({
        data: {
          providerId: body.providerId,
          userId: body.userId,
        },
      });
      return new ApiSuccessResponse(
        true,
        'Course Academy created successfully',
        courseAcademy,
      );
    }
    const courseAcademy = await this.prismaService.courseAcademy.create({
      data: {
        providerId: body.providerId,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Course Academy created successfully',
      courseAcademy,
    );
  }

  async findAll(user: Auth) {
    const courseAcademies = await this.prismaService.courseAcademy.findMany({
      where: {
        userId: user.id,
      },
    });
    if (!courseAcademies) {
      throw new BadRequestException('No course academies found');
    }
    return new ApiSuccessResponse(true, 'Course academies found', {
      courseAcademies,
    });
  }

  async findOne(id: string) {
    const courseAcademy = await this.prismaService.courseAcademy.findUnique({
      where: {
        id: id,
      },
    });
    if (!courseAcademy) {
      throw new BadRequestException('Course academy not found');
    }
    return new ApiSuccessResponse(true, 'Course academy found', courseAcademy);
  }

  async update(id: string, body: UpdateCourseAcademyDto, user: Auth) {
    const existingCourseAcademy =
      await this.prismaService.courseAcademy.findUnique({
        where: {
          id: id,
        },
      });
    if (!existingCourseAcademy) {
      throw new BadRequestException('Course academy not found');
    }
    const courseAcademy = await this.prismaService.courseAcademy.update({
      where: {
        id: id,
      },
      data: {
        providerId: body.providerId,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Course academy updated successfully',
      courseAcademy,
    );
  }

  async remove(id: string, user: Auth) {
    const existingCourseAcademy =
      await this.prismaService.courseAcademy.findUnique({
        where: {
          id: id,
        },
      });
    if (!existingCourseAcademy) {
      throw new BadRequestException('Course academy not found');
    }
    const courseAcademy = await this.prismaService.courseAcademy.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Course academy deleted successfully',
      courseAcademy,
    );
  }
}
