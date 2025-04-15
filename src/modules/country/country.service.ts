import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';

@Injectable()
export class CountryService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(body: CreateCountryDto) {
    const country = await this.prismaService.country.create({
      data: {
        name: body.name,
        code: body.code,
        currencyName: body.currencyName,
        currencySymbol: body.currencySymbol,
        currencyCode: body.currencyCode,
        pincodeLength: body.pincodeLength,
        phoneNumberLength: body.phoneNumberLength,
        status: body.status,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Country created successfully',
      country,
    );
  }

  async findAll() {
    const countries = await this.prismaService.country.findMany();
    if (!countries) {
      throw new BadRequestException('No countries found');
    }
    return new ApiSuccessResponse(true, 'Countries found', { countries });
  }

  async findOne(id: string) {
    const country = await this.prismaService.country.findUnique({
      where: {
        id: id,
      },
    });
    if (!country) {
      throw new BadRequestException('Country not found');
    }
    return new ApiSuccessResponse(true, 'Country found', country);
  }

  async update(id: string, body: UpdateCountryDto) {
    const existingCountry = await this.prismaService.country.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingCountry) {
      throw new BadRequestException('Country not found');
    }
    const country = await this.prismaService.country.update({
      where: {
        id: id,
      },
      data: {
        name: body.name,
        code: body.code,
        currencyName: body.currencyName,
        currencySymbol: body.currencySymbol,
        currencyCode: body.currencyCode,
        pincodeLength: body.pincodeLength,
        phoneNumberLength: body.phoneNumberLength,
        status: body.status,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Country updated successfully',
      country,
    );
  }

  async remove(id: string) {
    const existingCountry = await this.prismaService.country.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingCountry) {
      throw new BadRequestException('Country not found');
    }
    const country = await this.prismaService.country.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Country updated successfully',
      country,
    );
  }

  // Countries

  async addCountry(body: CreateCountryDto) {
    const existingCountry = await this.prismaService.country.create({
      data: {
        code: body.code,
        currencyName: body.currencyName,
        phoneNumberLength: body.phoneNumberLength,
        currencySymbol: body.currencySymbol,
        pincodeLength: body.pincodeLength,
        name: body.name,
      },
    });
    return new ApiSuccessResponse(
      true,
      'country added successfully',
      existingCountry,
    );
  }

  async getCountry(id: string) {
    const country = await this.prismaService.country.findUnique({
      where: {
        id,
      },
    });
    if (!country) {
      throw new NotFoundException('Country Not Found');
    }
    return new ApiSuccessResponse(
      true,
      'Country Data fetched successfully',
      country,
    );
  }

  async getCountries() {
    const countries = await this.prismaService.country.findMany();
    if (!countries) throw new NotFoundException('Country Data Found');
    return new ApiSuccessResponse(true, 'Countries Data', { countries });
  }

  async updateCountries(id: string, body: UpdateCountryDto) {
    const existingCountries = await this.prismaService.country.findUnique({
      where: { id },
    });
    if (existingCountries) throw new NotFoundException('Countries Not Found');
    await this.prismaService.country.update({
      where: { id },
      data: { ...body },
    });
    return new ApiSuccessResponse(true, 'Update Country Successfully', null);
  }

  async deleteCountry(id: string) {
    const existingCountry = await this.prismaService.country.findUnique({
      where: { id },
    });
    if (!existingCountry) throw new NotFoundException('Country Not Found');

    await this.prismaService.country.delete({ where: { id } });
    return new ApiSuccessResponse(true, 'Country Deleted Successfully', null);
  }
}
