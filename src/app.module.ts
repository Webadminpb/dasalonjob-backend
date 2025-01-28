import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BasicdetailsModule } from './modules/basicdetails/basicdetails.module';
import { ContactdetailsModule } from './modules/contactdetails/contactdetails.module';
import { LangaugesModule } from './modules/langauges/langauges.module';
import { SkillsModule } from './modules/skills/skills.module';

@Module({
  imports: [AuthModule, BasicdetailsModule, ContactdetailsModule, LangaugesModule, SkillsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
