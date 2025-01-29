import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BasicdetailsModule } from './modules/basicdetails/basicdetails.module';
import { ContactdetailsModule } from './modules/contactdetails/contactdetails.module';
import { LangaugesModule } from './modules/langauges/langauges.module';
import { SkillsModule } from './modules/skills/skills.module';
import { JobpreferenceModule } from './modules/jobpreference/jobpreference.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { PastworkModule } from './modules/pastwork/pastwork.module';
import { EducationModule } from './modules/education/education.module';

@Module({
  imports: [AuthModule, BasicdetailsModule, ContactdetailsModule, LangaugesModule, SkillsModule, JobpreferenceModule, ExperienceModule, PastworkModule, EducationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
