import { DiscoveryService } from './discovery.service';
import { FeedQueryDto } from './dto/feed-query.dto';
import { RequestUser } from '../../common/decorators/current-user.decorator';
export declare class DiscoveryController {
    private readonly discovery;
    constructor(discovery: DiscoveryService);
    getFeed(user: RequestUser, query: FeedQueryDto): Promise<{
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
    getLikesReceived(user: RequestUser): Promise<{
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
}
