import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SavedApplicantService } from './saved-applicant.service';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import {
  CreateSavedApplicantDto,
  UpdateSavedApplicantDto,
} from './dto/create-saved-applicant.dto';
import { Auth } from '@prisma/client';
import { QuerySavedApplicant } from './dto/query-saved-applicant.dto';

@Controller('saved-applicant')
export class SavedApplicantController {
  constructor(private readonly savedApplicantService: SavedApplicantService) {}

  @Post('/agency')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  createSavedApplicant(
    @Body() body: CreateSavedApplicantDto,
    @GetUser() user: Auth,
  ) {
    return this.savedApplicantService.createSavedApplicant(body, user);
  }

  @Get('/agency')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  getAgencyApplicants(
    @Query() query: QuerySavedApplicant,
    @GetUser() user: Auth,
  ) {
    return this.savedApplicantService.getSavedApplicants(query, user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  getAgencyApplicant(@Param('id') id: string) {
    return this.savedApplicantService.getSavedApplicant(id);
  }

  @Put('/agency/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  updateAgencyApplicant(
    @Body() body: UpdateSavedApplicantDto,
    @Param('id') id: string,
    @GetUser() user: Auth,
  ) {
    return this.savedApplicantService.updateSavedApplicant(id, body, user);
  }

  @Delete('/agency/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  deleteAgencyApplicant(@Param('id') id: string, @GetUser() user: Auth) {
    return this.savedApplicantService.deleteSavedApplicant(id, user);
  }
}
