import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';
import { CreateApplicantDto } from './dto/applicant.profile';
import { ApiTags } from '@nestjs/swagger';
import { CreateChangePasswordDto } from './dto/change-password';
import { UpdateAccountStatusDto } from './dto/status-auth';

@ApiTags('users')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  signup(@Body() body: CreateAuthDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() body: CreateAuthDto) {
    return this.authService.login(body);
  }

  @Get('partner/profile')
  @HttpCode(200)
  @AllowAuthenticated('USER', 'PARTNER')
  getMyProfile(@GetUser() user: Auth) {
    return this.authService.getMyPartnerProfile(user);
  }

  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  changePassword(@Body() body: CreateChangePasswordDto, @GetUser() user: Auth) {
    return this.authService.changePassword(body, user);
  }

  @Patch('account-status')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  updateAccountStatus(
    @Body() body: UpdateAccountStatusDto,
    @GetUser() user: Auth,
  ) {
    return this.authService.updateAccountStatus(body, user);
  }

  @Put('applicant')
  @AllowAuthenticated('USER')
  updateApplicantProfile(
    @Body() body: CreateApplicantDto,
    @GetUser() user: Auth,
  ) {
    return this.authService.updateApplicantProfile(body, user);
  }
}
