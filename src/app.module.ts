import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BasicdetailsModule } from './modules/basicdetails/basicdetails.module';
import { ContactdetailsModule } from './modules/contact-details/contact-details.module';
import { LangaugesModule } from './modules/languages/languages.module';
import { SkillsModule } from './modules/skills/skills.module';
import { JobpreferenceModule } from './modules/jobpreference/jobpreference.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { PastworkModule } from './modules/pastwork/pastwork.module';
import { EducationModule } from './modules/education/education.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SalondetailsModule } from './modules/salondetails/salondetails.module';
import { VenuedetailsModule } from './modules/venue-details/venue-details.module';
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
import { AgencyJobBasicInfoModule } from './modules/agency-job-basic-info/agency-job-basic-info.module';
import { AgencyPartnerSalonsModule } from './modules/agency-partner-salons/agency-partner-salons.module';
import { JobPostModule } from './modules/job-post/job-post.module';
import { JobApplicationsModule } from './modules/job-applications/job-applications.module';
import { JobApplicationMessageModule } from './modules/job-application-message/job-application-message.module';
import { SaveJobPostModule } from './modules/save-job-post/save-job-post.module';
import { PartnerSocialLinksModule } from './modules/partner-social-links/partner-social-links.module';
import { CountryModule } from './modules/country/country.module';
import { VenueAmenitiesModule } from './modules/venue-amenities/venue-amenities.module';
import { VenueWorkstationModule } from './modules/venue-workstation/venue-workstation.module';
import { PartnerVenueModule } from './modules/partner-venue/partner-venue.module';
import { CourseDetailsModule } from './modules/course-details/course-details.module';
import { CourseContentModule } from './modules/course-content/course-content.module';
import { CourseAcademyModule } from './modules/course-academy/course-academy.module';
import { CourseTypeAndLocationModule } from './modules/course-type-and-location/course-type-and-location.module';
import { PartnerCourseModule } from './modules/partner-course/partner-course.module';
import { SaveCourseModule } from './modules/save-course/save-course.module';
import { CourseApplicationModule } from './modules/course-applications/course-application.module';
import { UserLanguagesModule } from './modules/user-languages/user-languages.module';
import { PartnerPersonalDataModule } from './modules/partner-personal-data/partner-personal-data.module';
import { ActivityModule } from './modules/activity/activity.module';

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
    AgencyJobBasicInfoModule,
    AgencyPlanModule,
    AgencyPartnerSalonsModule,
    JobPostModule,
    JobApplicationsModule,
    JobApplicationMessageModule,
    SaveJobPostModule,
    PartnerSocialLinksModule,
    CountryModule,
    VenueAmenitiesModule,
    VenueWorkstationModule,
    PartnerVenueModule,
    CourseDetailsModule,
    CourseContentModule,
    CourseAcademyModule,
    CourseTypeAndLocationModule,
    PartnerCourseModule,
    SaveCourseModule,
    CourseApplicationModule,
    UserLanguagesModule,
    PartnerPersonalDataModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
