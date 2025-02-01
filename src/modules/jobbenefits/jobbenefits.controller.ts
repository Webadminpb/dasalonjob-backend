import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { JobBenefitsService } from './jobbenefits.service';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { CreateJobBenefitsDto } from './dto/create-jobbenefit.dto';
import { UpdateJobBenefitsDto } from './dto/update-jobbenefit.dto';

@Controller('job-benefits')
export class JobBenefitsController {
  constructor(private readonly jobBenefitsService: JobBenefitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateJobBenefitsDto, @GetUser() user: Auth) {
    return this.jobBenefitsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyJobBenefits(@GetUser() user: Auth) {
    return this.jobBenefitsService.findMyJobBenefits(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(@Body() body: UpdateJobBenefitsDto, @GetUser() user: Auth) {
    return this.jobBenefitsService.update(user, body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth) {
    return this.jobBenefitsService.remove(user);
  }
}
