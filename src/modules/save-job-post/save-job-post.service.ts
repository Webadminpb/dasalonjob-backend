import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { UpdateSaveJobPostDto } from './dto/update-save-job-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateASaveJobPostDto } from './dto/create-save-job-post.dto';

@Injectable()
export class SaveJobPostService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(body: CreateASaveJobPostDto, user: Auth) {
    const { jobPostId } = body;
    const isExistsJobPost = await this.prismaService.jobPost.findFirst({
      where:{
        id:jobPostId
      }
    });
    if(!isExistsJobPost) throw new NotFoundException("Job Post Not Found");

    const existingSaveJobPost = await this.prismaService.saveJobPost.findFirst({
      where: {
        jobPostId,
        userId: user.id,
      },
    });

    if (existingSaveJobPost) {
      throw new BadRequestException('Already saved');
    }
    
    const saveJobPost = await this.prismaService.saveJobPost.create({
      data: {
        jobPostId,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(true, 'Saved successfully', saveJobPost);
  }

  async findAll(user: Auth) {
    const [saveJobPosts, total] = await Promise.all([
      this.prismaService.saveJobPost.findMany({
        where: {
          userId: user.id,
        },
        include: {
          jobPost: {
            include: {
              _count: {
                select: {
                  jobApplications: {
                    where: {
                      userId: user.id,
                    },
                  },
                  saveJobPosts: {
                    where: {
                      userId: user.id,
                    },
                  },
                },
              },
              jobBasicInfo: {
                include: {
                  venue: {
                    include: {
                      venueBasicDetails: {
                        include: {
                          files: true,
                        },
                      },
                    },
                  },
                },
              },
              jobBenefits: true,
              jobDescription: true,
              jobQualification: true,
            },
          },
        },
      }),
      this.prismaService.saveJobPost.count({
        where: {
          userId: user.id,
        },
      }),
    ]);
    if (!saveJobPosts) {
      throw new NotFoundException('Save job post not found');
    }

    return new ApiSuccessResponse(true, 'Get all save job post successfully', {
      saveJobPosts,
      total,
    });
  }

  async findOne(id: string, user: Auth) {
    const saveJobPost = await this.prismaService.saveJobPost.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!saveJobPost) {
      throw new NotFoundException('Save job post not found');
    }
    return new ApiSuccessResponse(
      true,
      'Get save job post successfully',
      saveJobPost,
    );
  }

  async update(id: string, body: UpdateSaveJobPostDto, user: Auth) {
    const existingSaveJobPost = await this.prismaService.saveJobPost.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingSaveJobPost) {
      throw new NotFoundException('Save job post not found');
    }

    const updatedSaveJobPost = await this.prismaService.saveJobPost.update({
      where: { id },
      data: body,
    });
    return new ApiSuccessResponse(
      true,
      'Save job post updated successfully',
      updatedSaveJobPost,
    );
  }

  async remove(id: string, user: Auth) {
    const existingSaveJobPost = await this.prismaService.saveJobPost.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingSaveJobPost) {
      throw new NotFoundException('Save job post not found');
    }

    await this.prismaService.saveJobPost.delete({
      where: { id },
    });
    return new ApiSuccessResponse(
      true,
      'Save job post deleted successfully',
      null,
    );
  }
}
