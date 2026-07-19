import { PrismaService } from '../../prisma/prisma.service';
import { FeedQueryDto } from './dto/feed-query.dto';
export declare class DiscoveryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getFeed(userId: string, query: FeedQueryDto): Promise<{
        profiles: {
            profileId: string;
            userId: string;
            firstName: string;
            displayName: string;
            age: number;
            gender: string;
            denomination: string;
            churchInvolvement: string;
            faithLevel: string;
            marriageIntent: string;
            bio: string;
            occupation: string;
            city: string;
            state: string;
            emailVerified: boolean;
            profileCompletionPercent: number;
            photos: {
                id: string;
                url: string;
                isPrimary: boolean;
            }[];
        }[];
        nextCursor: string;
        remaining: number;
    }>;
    getLikesReceived(userId: string): Promise<{
        likes: {
            primaryPhotoUrl: string;
            isSuperLike: boolean;
            likedAt: Date;
            profileId: string;
            userId: string;
            firstName: string;
            displayName: string;
            age: number;
            gender: string;
            denomination: string;
            churchInvolvement: string;
            faithLevel: string;
            marriageIntent: string;
            bio: string;
            occupation: string;
            city: string;
            state: string;
            emailVerified: boolean;
            profileCompletionPercent: number;
            photos: {
                id: string;
                url: string;
                isPrimary: boolean;
            }[];
        }[];
        count: number;
    }>;
    private serializeProfile;
}
