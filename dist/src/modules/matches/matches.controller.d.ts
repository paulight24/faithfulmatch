import { MatchesService } from './matches.service';
import { RequestUser } from '../../common/decorators/current-user.decorator';
export declare class MatchesController {
    private readonly matches;
    constructor(matches: MatchesService);
    getMyMatches(user: RequestUser): Promise<{
        matchId: string;
        matchedAt: Date;
        status: import(".prisma/client").$Enums.MatchStatus;
        conversationId: string;
        lastMessageAt: Date;
        lastMessage: {
            content: string;
            senderId: string;
            sentAt: Date;
        };
        profile: {
            userId: string;
            firstName: string;
            displayName: string;
            city: string;
            state: string;
            primaryPhotoUrl: string;
        };
    }[]>;
    getMatchDetail(user: RequestUser, matchId: string): Promise<{
        matchId: string;
        matchedAt: Date;
        status: import(".prisma/client").$Enums.MatchStatus;
        conversationId: string;
        profile: {
            photos: {
                id: string;
                url: string;
                isPrimary: boolean;
            }[];
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
    }>;
    startConversation(user: RequestUser, matchId: string): Promise<{
        conversationId: string;
    }>;
    unmatch(user: RequestUser, matchId: string): Promise<{
        message: string;
    }>;
}
