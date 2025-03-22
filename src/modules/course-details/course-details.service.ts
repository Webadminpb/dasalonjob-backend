import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateCourseDetailsDto } from './dto/create-course-detail.dto';
import { UpdateCourseDetailsDto } from './dto/update-course-detail.dto';
import { Auth } from '@prisma/client';

@Injectable()
export class CourseDetailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateCourseDetailsDto) {
    const courseDetails = await this.prismaService.courseDetails.create({
      data: {
        jobProfile: body.jobProfile,
        courseName: body.courseName,
        courseType: body.courseType,
        startDate: new Date(body.startDate).toISOString(),
        endDate: new Date(body.endDate).toISOString(),
        price: body.price,
        offerPrice: body.offerPrice,
        isPlacement: body.isPlacement || false,
        providerId: body.providerId,
        fileId: body.fileId,
        userId: body.userId,
      },
    });
    return new ApiSuccessResponse(
      true,
      'CourseDetails created successfully',
      courseDetails,
    );
  }

  async findAll(user: Auth) {
    const courseDetails = await this.prismaService.courseDetails.findMany({
      where: {
        userId: user.id,
      },
    });
    if (!courseDetails) {
      throw new BadRequestException('No course details found');
    }
    return new ApiSuccessResponse(true, 'CourseDetails found', {
      courseDetails,
    });
  }

  async findOne(id: string) {
    const courseDetails = await this.prismaService.courseDetails.findUnique({
      where: {
        id: id,
      },
    });
    if (!courseDetails) {
      throw new BadRequestException('CourseDetails not found');
    }
    return new ApiSuccessResponse(true, 'CourseDetails found', courseDetails);
  }

  async update(id: string, body: UpdateCourseDetailsDto, user: Auth) {
    const existingCourseDetails =
      await this.prismaService.courseDetails.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingCourseDetails) {
      throw new BadRequestException('CourseDetails not found');
    }
    const courseDetails = await this.prismaService.courseDetails.update({
      where: {
        id: id,
      },
      data: {
        jobProfile: body.jobProfile,
        courseName: body.courseName,
        courseType: body.courseType,
        startDate: body.startDate
          ? new Date(body.startDate).toISOString()
          : undefined,
        endDate: body.endDate
          ? new Date(body.endDate).toISOString()
          : undefined,
        price: body.price,
        offerPrice: body.offerPrice,
        isPlacement: body.isPlacement,
        providerId: body.providerId,
        fileId: body.fileId,
        userId: body.userId,
      },
    });
    return new ApiSuccessResponse(
      true,
      'CourseDetails updated successfully',
      courseDetails,
    );
  }

  async remove(id: string, user: Auth) {
    const existingCourseDetails =
      await this.prismaService.courseDetails.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingCourseDetails) {
      throw new BadRequestException('CourseDetails not found');
    }
    const courseDetails = await this.prismaService.courseDetails.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'CourseDetails deleted successfully',
      courseDetails,
    );
  }
}
