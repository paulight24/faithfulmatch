import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RequestUser } from '../../common/decorators/current-user.decorator';
export declare class ProfilesController {
    private readonly profiles;
    constructor(profiles: ProfilesService);
    getMyProfile(user: RequestUser): Promise<{
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
    updateMyProfile(user: RequestUser, dto: UpdateProfileDto): Promise<{
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
    uploadPhoto(user: RequestUser, file: Express.Multer.File): Promise<{
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
    deletePhoto(user: RequestUser, photoId: string): Promise<{
        message: string;
    }>;
    setPrimary(user: RequestUser, photoId: string): Promise<{
        message: string;
    }>;
    updateVisibility(user: RequestUser, body: {
        visible: boolean;
    }): Promise<{
        message: string;
        visibilityStatus: "VISIBLE" | "HIDDEN";
    }>;
    getBoostStatus(user: RequestUser): Promise<{
        isActive: boolean;
        boostActiveUntil: Date;
        boostAvailableAt: Date;
    }>;
    activateBoost(user: RequestUser): Promise<{
        isActive: boolean;
        boostActiveUntil: Date;
        boostAvailableAt: Date;
    }>;
}
