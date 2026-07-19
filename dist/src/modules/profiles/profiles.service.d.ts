import { PrismaService } from '../../prisma/prisma.service';
import { StorageProvider } from '../../infrastructure/storage/storage-provider.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AiService } from '../ai/ai.service';
import { ConfigService } from '@nestjs/config';
export declare class ProfilesService {
    private readonly prisma;
    private readonly storage;
    private readonly aiService;
    private readonly config;
    private readonly storageProviderName;
    constructor(prisma: PrismaService, storage: StorageProvider, aiService: AiService, config: ConfigService);
    getOrCreateProfile(userId: string): Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string | null;
            displayName: string | null;
            birthday: Date | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            denomination: string | null;
            churchInvolvement: import(".prisma/client").$Enums.ChurchInvolvement | null;
            faithLevel: import(".prisma/client").$Enums.FaithLevel | null;
            marriageIntent: import(".prisma/client").$Enums.MarriageIntent | null;
            bio: string | null;
            occupation: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            zip: string | null;
            latitudeApprox: number | null;
            longitudeApprox: number | null;
            boostActiveUntil: Date | null;
            boostAvailableAt: Date | null;
            profileCompletionPercent: number;
            visibilityStatus: import(".prisma/client").$Enums.ProfileVisibilityStatus;
            userId: string;
        };
        photos: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            url: string;
            storageKey: string;
            storageProvider: string;
            mimeType: string | null;
            sizeBytes: number | null;
            sortOrder: number;
            isPrimary: boolean;
            moderationStatus: import(".prisma/client").$Enums.PhotoModerationStatus;
            rejectionReason: string | null;
        }[];
        completion: import("./profile-completion.util").CompletionResult;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string | null;
            displayName: string | null;
            birthday: Date | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            denomination: string | null;
            churchInvolvement: import(".prisma/client").$Enums.ChurchInvolvement | null;
            faithLevel: import(".prisma/client").$Enums.FaithLevel | null;
            marriageIntent: import(".prisma/client").$Enums.MarriageIntent | null;
            bio: string | null;
            occupation: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            zip: string | null;
            latitudeApprox: number | null;
            longitudeApprox: number | null;
            boostActiveUntil: Date | null;
            boostAvailableAt: Date | null;
            profileCompletionPercent: number;
            visibilityStatus: import(".prisma/client").$Enums.ProfileVisibilityStatus;
            userId: string;
        };
        completion: import("./profile-completion.util").CompletionResult;
    }>;
    uploadPhoto(userId: string, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        url: string;
        storageKey: string;
        storageProvider: string;
        mimeType: string | null;
        sizeBytes: number | null;
        sortOrder: number;
        isPrimary: boolean;
        moderationStatus: import(".prisma/client").$Enums.PhotoModerationStatus;
        rejectionReason: string | null;
    }>;
    deletePhoto(userId: string, photoId: string): Promise<{
        message: string;
    }>;
    setPrimaryPhoto(userId: string, photoId: string): Promise<{
        message: string;
    }>;
    approvePhoto(photoId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        url: string;
        storageKey: string;
        storageProvider: string;
        mimeType: string | null;
        sizeBytes: number | null;
        sortOrder: number;
        isPrimary: boolean;
        moderationStatus: import(".prisma/client").$Enums.PhotoModerationStatus;
        rejectionReason: string | null;
    }>;
    rejectPhoto(photoId: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        url: string;
        storageKey: string;
        storageProvider: string;
        mimeType: string | null;
        sizeBytes: number | null;
        sortOrder: number;
        isPrimary: boolean;
        moderationStatus: import(".prisma/client").$Enums.PhotoModerationStatus;
        rejectionReason: string | null;
    }>;
    setVisibility(userId: string, visible: boolean): Promise<{
        message: string;
        visibilityStatus: "VISIBLE" | "HIDDEN";
    }>;
    private static readonly BOOST_DURATION_MS;
    private static readonly BOOST_COOLDOWN_MS;
    getBoostStatus(userId: string): Promise<{
        isActive: boolean;
        boostActiveUntil: Date;
        boostAvailableAt: Date;
    }>;
    activateBoost(userId: string): Promise<{
        isActive: boolean;
        boostActiveUntil: Date;
        boostAvailableAt: Date;
    }>;
    private refreshCompletionScore;
}
