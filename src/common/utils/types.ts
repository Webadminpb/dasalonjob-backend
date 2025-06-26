import { PartnerVenue } from '@prisma/client';

export type ExtendedPartnerVenue = PartnerVenue & {
  collaborationStatus:
    | 'Approved'
    | 'Pending'
    | 'Partner Requested'
    | 'Agency Requested';
};
