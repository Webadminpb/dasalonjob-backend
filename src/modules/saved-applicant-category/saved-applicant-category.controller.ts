import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SavedApplicantCategoryService } from './saved-applicant-category.service';
import {
  CreateSavedApplicantCategoryDto,
  UpdateSavedApplicantCategoryDto,
} from './dto/create-saved-applicant-category.dto';
import { Auth } from '@prisma/client';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';

@Controller('saved-applicant-categories')
export class SavedApplicantCategoryController {
  constructor(
    private readonly savedApplicantCategoryService: SavedApplicantCategoryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated()
  async create(
    @Body() createSavedApplicantCategoryDto: CreateSavedApplicantCategoryDto,
    @GetUser() user: Auth,
  ) {
    return this.savedApplicantCategoryService.create(
      createSavedApplicantCategoryDto,
      user,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  async findAll(@GetUser() user: Auth) {
    return this.savedApplicantCategoryService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  async findOne(@Param('id') id: string, @GetUser() user: Auth) {
    return this.savedApplicantCategoryService.findOne(id, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  async update(
    @Param('id') id: string,
    @Body() updateSavedApplicantCategoryDto: UpdateSavedApplicantCategoryDto,
    @GetUser() user: Auth,
  ) {
    return this.savedApplicantCategoryService.update(
      id,
      updateSavedApplicantCategoryDto,
      user,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  async remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.savedApplicantCategoryService.remove(id, user);
  }
}
