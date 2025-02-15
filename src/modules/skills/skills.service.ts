import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';

@Injectable()
export class SkillsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(body: CreateSkillDto, user: Auth) {
    const skills = await this.prismaService.skills.create({
      data: {
        skills: body.skills,
        userId: user.id,
      },
    });

    return new ApiSuccessResponse(true, 'skills added ', skills);
  }

  async findMySkills(user: Auth) {
    const skills = await this.prismaService.skills.findMany({
      where: { userId: user.id },
    });
    if (!skills) {
      throw new NotFoundException('skills not found');
    }
    return new ApiSuccessResponse(true, 'skills data', { skills });
  }

  async findOne(id: string) {
    const skills = await this.prismaService.skills.findMany({
      where: { id },
    });
    if (!skills) {
      throw new NotFoundException('skills not found');
    }
    return new ApiSuccessResponse(true, 'skills data', skills);
  }

  async update(id: string, body: UpdateSkillDto, user: Auth) {
    const existingSkills = await this.prismaService.skills.findUnique({
      where: {
        userId: user.id,
        id,
      },
    });
    if (!existingSkills) {
      throw new NotFoundException('skills not found');
    }
    const updatedSkills = await this.prismaService.skills.update({
      where: {
        id: existingSkills.id,
      },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(true, 'skill updated', updatedSkills);
  }

  async remove(id: string, user: Auth) {
    const existingSkills = await this.prismaService.skills.findUnique({
      where: {
        userId: user.id,
        id,
      },
    });
    if (!existingSkills) {
      throw new NotFoundException('skills not found');
    }
    await this.prismaService.skills.delete({
      where: {
        id: existingSkills.id,
      },
    });
    return new ApiSuccessResponse(true, 'skill updated', null);
  }
}
