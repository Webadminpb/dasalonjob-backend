import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BasicdetailsModule } from './modules/basic-details/basic-details.module';
import { ContactdetailsModule } from './modules/contact-details/contact-details.module';
import { LangaugesModule } from './modules/languages/languages.module';
import { SkillsModule } from './modules/skills/skills.module';
import { JobpreferenceModule } from './modules/job-preference/job-preference.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { PastworkModule } from './modules/past-work/pastwork.module';
import { EducationModule } from './modules/education/education.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SalondetailsModule } from './modules/salon-details/salon-details.module';
import { VenuedetailsModule } from './modules/venue-details/venue-details.module';
import { VenuebusinesstypeModule } from './modules/venue-business-type/venuebusinesstype.module';
import { VenuebusinessdaysModule } from './modules/venue-business-days/venuebusinessdays.module';
import { VenuebusinessservicesModule } from './modules/venue-business-services/venuebusinessservices.module';
import { JobbasicinfoModule } from './modules/job-basic-info/job-basic-info.module';
import { JobdescriptionModule } from './modules/job-description/job-description.module';
import { JobqualificationModule } from './modules/job-qualification/job-qualification.module';
import { JobbenefitsModule } from './modules/job-benefits/job-benefits.module';
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
import { WhatsappGroupsModule } from './modules/whatsapp-groups/whatsapp-groups.module';
import { AgencyPersonalDetailsModule } from './modules/agency-personal-details/agency-personal-details.module';
import { AgencyTeamMembersModule } from './modules/agency-team-members/agency-team-members.module';
import { PartnerAgencyJobPermissionModule } from './modules/partner-agency-job-permission/partner-agency-job-permission.module';
import { FeaturedJobsModule } from './modules/featured-jobs/featured-jobs.module';
import { CreditPlansModule } from './modules/credit-plans/credit-plans.module';
import { CreditsModule } from './modules/credits/credits.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { SponsoredJobModule } from './modules/sponsored-jobs/sponsored-job-module';
import { SavedApplicantModule } from './modules/saved-applicant/saved-applicant.module';

@Module({
  imports: [
    SavedApplicantModule,
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
    WhatsappGroupsModule,
    AgencyPersonalDetailsModule,
    AgencyTeamMembersModule,
    PartnerAgencyJobPermissionModule,
    FeaturedJobsModule,
    CreditPlansModule,
    CreditsModule,
    SubscriptionModule,
    SponsoredJobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
