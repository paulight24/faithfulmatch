import { Gender, MarriageIntent } from '@prisma/client';
export declare class UpdatePreferencesDto {
    minAge?: number;
    maxAge?: number;
    maxDistanceMiles?: number;
    genderPreference?: Gender;
    denominationPreferences?: string[];
    marriageIntentPreferences?: MarriageIntent[];
}
