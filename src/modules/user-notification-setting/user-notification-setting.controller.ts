import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Auth, UserNotificationSetting } from '@prisma/client';
import { CreateOrUpdateUserNotificationSetting } from './dto/create-user-notification-setting.dto';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { UserNotificationSettingService } from './user-notification-setting.service';

@Controller('user-notification-settings')
export class UserNotificationSettingController {
  constructor(
    private readonly userNotificationSettingService: UserNotificationSettingService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  addOrUpdateNotificationSetting(
    @Body() body: CreateOrUpdateUserNotificationSetting,
    @GetUser() user: Auth,
  ) {
    return this.userNotificationSettingService.addOrUpdateNotificationSetting(
      body,
      user,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  getUserNotificationSetting(@GetUser() user: Auth) {
    return this.userNotificationSettingService.getNotificationSettings(user);
  }
}
