import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
  Param,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { JobBenefitsService } from './job-benefits.service';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { CreateJobBenefitsDto } from './dto/create-jobbenefit.dto';
import { UpdateJobBenefitsDto } from './dto/update-jobbenefit.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('partner')
@Controller('job-benefits')
export class JobBenefitsController {
  constructor(private readonly jobBenefitsService: JobBenefitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN', 'AGENCY')
  create(@Body() body: CreateJobBenefitsDto, @GetUser() user: Auth) {
    return this.jobBenefitsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyJobBenefits(@GetUser() user: Auth) {
    return this.jobBenefitsService.findMyJobBenefits(user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  update(
    @Body() body: UpdateJobBenefitsDto,
    @GetUser() user: Auth,
    @Param('id') id: string,
  ) {
    return this.jobBenefitsService.update(id, user, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER', 'ADMIN', 'SUPER_ADMIN')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.jobBenefitsService.remove(id, user);
  }
}
