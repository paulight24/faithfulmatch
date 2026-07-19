import { Gender, MarriageIntent, FaithLevel, ChurchInvolvement } from '@prisma/client';
export declare class UpdateProfileDto {
    firstName?: string;
    displayName?: string;
    birthday?: string;
    gender?: Gender;
    denomination?: string;
    churchInvolvement?: ChurchInvolvement;
    faithLevel?: FaithLevel;
    marriageIntent?: MarriageIntent;
    bio?: string;
    occupation?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
}
