import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { generateJwtToken } from 'src/common/auth/auth-common';
import { generateSixDigitOTP } from 'src/common/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateApplicantDto } from './dto/applicant.profile';
import { Auth } from '@prisma/client';
import { CreateChangePasswordDto } from './dto/change-password';
import { UpdateAccountStatusDto } from './dto/status-auth';
import { CreateAuthFileDto } from './dto/file-dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(body: CreateAuthDto) {
    const phoneVerificationCode = await generateSixDigitOTP();
    const phoneVerificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const emailVerificationCode = await generateSixDigitOTP();
    const emailVerificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const user = await this.prismaService.auth.create({
      data: {
        email: body.email,
        password: body.password,
        role: body.role,
        phone: body.phone,
        countryId: body.countryId,
        isPhoneVerified: body.isPhoneVerified,
        isEmailVerified: body.isEmailVerified,
        phoneVerificationCode: body.phoneVerificationCode,
        emailVerificationCode: body.emailVerificationCode,
        phoneVerificationCodeExpiry: body.phoneVerificationCodeExpiry,
        emailVerificationCodeExpiry: body.emailVerificationCodeExpiry,
      },
    });
    const updateUser = await this.prismaService.auth.update({
      where: {
        id: user.id,
      },
      data: {
        phoneVerificationCode,
        emailVerificationCode,
        phoneVerificationCodeExpiry,
        emailVerificationCodeExpiry,
      },
    });
    return new ApiSuccessResponse(
      true,
      'User created successfully',
      updateUser,
    );
  }

  async login(body: LoginAuthDto) {
    const user = await this.prismaService.auth.findUnique({
      where: { email: body.email },
      include: {
        profileImage: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== body.password) {
      throw new BadRequestException('Invalid password');
    }
    const token = await generateJwtToken(user);
    return new ApiSuccessResponse(true, 'User logged in successfully', {
      user,
      token,
    });
  }

  async updateApplicantProfile(body: CreateApplicantDto, user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(true, 'user updated', updatedUser);
  }

  async myApplicantProfile(user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
      include: {
        basicDetails: true,
        languages: true,
        contactDetails: true,
        jobPreference: true,
        pastExperiences: true,
        PastWork: true,
        educations: true,
        certificates: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return new ApiSuccessResponse(true, 'User data', existingUser);
  }

  async getMyPartnerProfile(user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
      include: {
        profileImage: true,
        salonDetails: true,
        venueDetails: true,
        venueMainBusinessDays: true,
        venueMainBusinessServices: true,
        partnerSocialLinks: true,
        partnerPersonalData: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return new ApiSuccessResponse(true, 'User data', existingUser);
  }
  async getMyApplicantProfile(user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
      include: {
        basicDetails: true,
        languages: true,
        contactDetails: true,
        jobPreference: true,
        pastExperiences: true,
        PastWork: true,
        educations: true,
        certificates: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return new ApiSuccessResponse(true, 'User data', existingUser);
  }

  async changePassword(body: CreateChangePasswordDto, user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    if (existingUser.password !== body.current_password) {
      throw new BadRequestException('Invalid old password');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: body.new_password,
      },
    });
    return new ApiSuccessResponse(true, 'Password updated', updatedUser);
  }

  async deactiveAccount(user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        status: 'INACTIVE',
      },
    });
    return new ApiSuccessResponse(true, 'Account deactivated', updatedUser);
  }

  async updateAccountStatus(body: UpdateAccountStatusDto, user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        status: body.status,
      },
    });
    return new ApiSuccessResponse(true, 'Account activated', updatedUser);
  }
  async updateProfileImage(body: CreateAuthFileDto, user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        profileImageId: body.profileImageId,
      },
    });
    return new ApiSuccessResponse(true, 'Account activated', updatedUser);
  }
  async updateVerificationFile(body: CreateAuthFileDto, user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        verificationFileId: body.verificationFileId,
      },
    });
    return new ApiSuccessResponse(true, 'Account activated', updatedUser);
  }
}
