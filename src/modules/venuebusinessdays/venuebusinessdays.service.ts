import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { CreateVenueMainBusinessDaysDto } from './dto/create-venuebusinessday.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { UpdateVenueMainBusinessDaysDto } from './dto/update-venuebusinessday.dto';

@Injectable()
export class VenueMainBusinessDaysService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateVenueMainBusinessDaysDto, user: Auth) {
    const existingVenueBusinessDays =
      await this.prismaService.venueMainBusinessDays.findUnique({
        where: { userId: user.id },
      });
    if (existingVenueBusinessDays) {
      throw new BadRequestException('venue business days already added');
    }
    const venueMainBusinessDays =
      await this.prismaService.venueMainBusinessDays.create({
        data: {
          days: {
            set: {
              monday: body.days.monday,
              tuesday: body.days.tuesday,
              wednesday: body.days.wednesday,
              thursday: body.days.thursday,
              friday: body.days.friday,
              saturday: body.days.saturday,
              sunday: body.days.sunday,
            },
          },
          userId: user.id,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Venue main business days added',
      venueMainBusinessDays,
    );
  }

  async findMyVenueMainBusinessDays(user: Auth) {
    const venueMainBusinessDays =
      await this.prismaService.venueMainBusinessDays.findUnique({
        where: { userId: user.id },
      });
    if (!venueMainBusinessDays) {
      throw new NotFoundException('Venue main business days not found');
    }
    return new ApiSuccessResponse(
      true,
      'Venue main business days found',
      venueMainBusinessDays,
    );
  }

  async update(user: Auth, body: UpdateVenueMainBusinessDaysDto) {
    const existingVenueMainBusinessDays =
      await this.prismaService.venueMainBusinessDays.findUnique({
        where: { userId: user.id },
      });

    if (!existingVenueMainBusinessDays) {
      throw new NotFoundException('Venue main business days not found');
    }

    const updatedDays = {
      ...existingVenueMainBusinessDays.days,
      ...body.days,
    };

    const updatedVenueMainBusinessDays =
      await this.prismaService.venueMainBusinessDays.update({
        where: { id: existingVenueMainBusinessDays.id },
        data: {
          days: updatedDays,
        },
      });

    return new ApiSuccessResponse(
      true,
      'Venue main business days updated',
      updatedVenueMainBusinessDays,
    );
  }

  async remove(user: Auth) {
    const existingVenueMainBusinessDays =
      await this.prismaService.venueMainBusinessDays.findUnique({
        where: { userId: user.id },
      });
    if (!existingVenueMainBusinessDays) {
      throw new NotFoundException('Venue main business days not found');
    }
    await this.prismaService.venueMainBusinessDays.delete({
      where: { id: existingVenueMainBusinessDays.id },
    });
    return new ApiSuccessResponse(
      true,
      'Venue main business days deleted',
      null,
    );
  }
}
