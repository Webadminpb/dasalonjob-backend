import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BasicdetailsModule } from './modules/basicdetails/basicdetails.module';
import { ContactdetailsModule } from './modules/contactdetails/contactdetails.module';
import { LangaugesModule } from './modules/languages/languages.module';
import { SkillsModule } from './modules/skills/skills.module';
import { JobpreferenceModule } from './modules/jobpreference/jobpreference.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { PastworkModule } from './modules/pastwork/pastwork.module';
import { EducationModule } from './modules/education/education.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SalondetailsModule } from './modules/salondetails/salondetails.module';
import { VenuedetailsModule } from './modules/venuedetails/venuedetails.module';
import { VenuebusinesstypeModule } from './modules/venuebusinesstype/venuebusinesstype.module';
import { VenuebusinessdaysModule } from './modules/venuebusinessdays/venuebusinessdays.module';
import { VenuebusinessservicesModule } from './modules/venuebusinessservices/venuebusinessservices.module';
import { JobbasicinfoModule } from './modules/jobbasicinfo/jobbasicinfo.module';
import { JobdescriptionModule } from './modules/jobdescription/jobdescription.module';
import { JobqualificationModule } from './modules/jobqualification/jobqualification.module';
import { JobbenefitsModule } from './modules/jobbenefits/jobbenefits.module';
import { AgencyDetailsModule } from './modules/agency-details/agency-details.module';
import { AgencyVenueDetailsModule } from './modules/agency-venue-details/agency-venue-details.module';
import { AgencyJobDescriptionModule } from './modules/agency-job-description/agency-job-description.module';
import { AgencyJobQualificationModule } from './modules/agency-job-qualification/agency-job-qualification.module';
import { AgencyJobBenefitsModule } from './modules/agency-job-benefits/agency-job-benefits.module';
import { AgencyPlanModule } from './modules/agency-plan/agency-plan.module';

@Module({
  imports: [
    AuthModule,
    BasicdetailsModule,
    ContactdetailsModule,
    LangaugesModule,
    SkillsModule,
    JobpreferenceModule,
    ExperienceModule,
    PastworkModule,
    EducationModule,
    CertificateModule,
    UploadsModule,
    SalondetailsModule,
    VenuedetailsModule,
    VenuebusinesstypeModule,
    VenuebusinessdaysModule,
    VenuebusinessservicesModule,
    JobbasicinfoModule,
    JobdescriptionModule,
    JobqualificationModule,
    JobbenefitsModule,
    AgencyDetailsModule,
    AgencyVenueDetailsModule,
    AgencyJobDescriptionModule,
    AgencyJobQualificationModule,
    AgencyJobBenefitsModule,
    AgencyPlanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
