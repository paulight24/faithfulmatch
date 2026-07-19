import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
export declare class PreferencesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOrCreate(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        minAge: number | null;
        maxAge: number | null;
        maxDistanceMiles: number | null;
        genderPreference: import(".prisma/client").$Enums.Gender | null;
        denominationPreferences: Prisma.JsonValue | null;
        marriageIntentPreferences: Prisma.JsonValue | null;
    }>;
    update(userId: string, dto: UpdatePreferencesDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        minAge: number | null;
        maxAge: number | null;
        maxDistanceMiles: number | null;
        genderPreference: import(".prisma/client").$Enums.Gender | null;
        denominationPreferences: Prisma.JsonValue | null;
        marriageIntentPreferences: Prisma.JsonValue | null;
    }>;
}
