import { Body, Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';
import { CreateApplicantDto } from './dto/applicant.profile';
import { ApiTags } from '@nestjs/swagger';

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
  @Put('applicant')
  @AllowAuthenticated('USER')
  updateApplicantProfile(
    @Body() body: CreateApplicantDto,
    @GetUser() user: Auth,
  ) {
    return this.authService.updateApplicantProfile(body, user);
  }
}
