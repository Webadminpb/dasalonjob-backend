import { Body, Controller, HttpCode, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { Auth } from '@prisma/client';
import { CreateApplicantDto } from './dto/applicant.profile';

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

  @Put('applicant')
  @AllowAuthenticated('USER')
  updateApplicantProfile(
    @Body() body: CreateApplicantDto,
    @GetUser() user: Auth,
  ) {
    return this.authService.updateApplicantProfile(body, user);
  }
}
