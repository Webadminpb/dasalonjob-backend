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
    console.log('body ', body);
    // const existingVenueBusinessDays =
    //   await this.prismaService.venueMainBusinessDays.findUnique({
    //     where: { userId: user.id },
    //   });
    // if (existingVenueBusinessDays) {
    //   throw new BadRequestException('venue business days already added');
    // }
    const venueMainBusinessDays =
      await this.prismaService.venueMainBusinessDays.create({
        data: {
          days: body.days, // Directly setting the structured Days object

          userId: user.id,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Venue main business days added',
      venueMainBusinessDays,
    );
  }

  async findMyVenueMainBusinessDays(id: string, user: Auth) {
    const venueMainBusinessDays =
      await this.prismaService.venueMainBusinessDays.findUnique({
        where: { id, userId: user.id },
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

  async findAllVenueMainBusinessDays(user: Auth) {
    const venueMainBusinessDays =
      await this.prismaService.venueMainBusinessDays.findMany({
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

  async update(id: string, user: Auth, body: UpdateVenueMainBusinessDaysDto) {
    const existingVenueMainBusinessDays =
      await this.prismaService.venueMainBusinessDays.findUnique({
        where: { id, userId: user.id },
      });

    if (!existingVenueMainBusinessDays) {
      throw new NotFoundException('Venue main business days not found');
    }

    // ✅ Ensure `days` is a proper object
    const existingDays = existingVenueMainBusinessDays.days
      ? JSON.parse(JSON.stringify(existingVenueMainBusinessDays.days))
      : {};

    const updatedDays = {
      ...existingDays,
      ...(body.days ?? {}),
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

  async remove(id: string, user: Auth) {
    const existingVenueMainBusinessDays =
      await this.prismaService.venueMainBusinessDays.findUnique({
        where: { id, userId: user.id },
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
