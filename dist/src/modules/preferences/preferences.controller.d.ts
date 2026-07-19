import { PreferencesService } from './preferences.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { RequestUser } from '../../common/decorators/current-user.decorator';
export declare class PreferencesController {
    private readonly preferences;
    constructor(preferences: PreferencesService);
    getMyPreferences(user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        minAge: number | null;
        maxAge: number | null;
        maxDistanceMiles: number | null;
        genderPreference: import(".prisma/client").$Enums.Gender | null;
        denominationPreferences: import("@prisma/client/runtime/library").JsonValue | null;
        marriageIntentPreferences: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateMyPreferences(user: RequestUser, dto: UpdatePreferencesDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        minAge: number | null;
        maxAge: number | null;
        maxDistanceMiles: number | null;
        genderPreference: import(".prisma/client").$Enums.Gender | null;
        denominationPreferences: import("@prisma/client/runtime/library").JsonValue | null;
        marriageIntentPreferences: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
