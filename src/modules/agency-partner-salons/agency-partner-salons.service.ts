import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgencyPartnerSalonDto } from './dto/create-agency-partner-salon.dto';
import { UpdateAgencyPartnerSalonDto } from './dto/update-agency-partner-salon.dto';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';

@Injectable()
export class AgencyPartnerSalonsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateAgencyPartnerSalonDto, user: Auth) {
    const agencyPartnerSalon =
      await this.prismaService.agencyPartnerSalons.create({
        data: {
          userId: user.id,
          partners: {
            create: body.partnerIds.map((partnerId) => ({
              userId: partnerId,
            })),
          },
        },
        include: { partners: true },
      });

    return new ApiSuccessResponse(
      true,
      'Salon added successfully',
      agencyPartnerSalon,
    );
  }

  async findAll() {
    const salons = await this.prismaService.agencyPartnerSalons.findMany({
      include: { partners: true },
    });
    return new ApiSuccessResponse(
      true,
      'Fetched all salons successfully',
      salons,
    );
  }

  async findOne(id: string) {
    const salon = await this.prismaService.agencyPartnerSalons.findUnique({
      where: { id },
      include: { partners: true },
    });

    if (!salon) {
      throw new NotFoundException('Salon not found');
    }

    return new ApiSuccessResponse(true, 'Fetched salon successfully', salon);
  }

  async update(id: string, body: UpdateAgencyPartnerSalonDto) {
    const existingSalon =
      await this.prismaService.agencyPartnerSalons.findUnique({
        where: { id },
      });

    if (!existingSalon) {
      throw new NotFoundException('Salon not found');
    }

    await this.prismaService.agencySalonRelation.deleteMany({
      where: { agencyId: id },
    });

    const updatedSalon = await this.prismaService.agencyPartnerSalons.update({
      where: { id },
      data: {
        partners: {
          create: body.partnerIds?.map((partnerId) => ({
            userId: partnerId,
          })),
        },
      },
      include: { partners: true },
    });

    return new ApiSuccessResponse(
      true,
      'Salon updated successfully',
      updatedSalon,
    );
  }

  async remove(id: string) {
    const existingSalon =
      await this.prismaService.agencyPartnerSalons.findUnique({
        where: { id },
      });

    if (!existingSalon) {
      throw new NotFoundException('Salon not found');
    }

    await this.prismaService.agencyPartnerSalons.delete({
      where: { id },
    });

    return new ApiSuccessResponse(true, 'Salon deleted successfully', null);
  }
}
