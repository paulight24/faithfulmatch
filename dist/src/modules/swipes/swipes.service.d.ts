import { PrismaService } from '../../prisma/prisma.service';
import { RecordSwipeDto } from './dto/record-swipe.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class SwipesService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    recordSwipe(swiperUserId: string, dto: RecordSwipeDto): Promise<{
        swipe: {
            id: string;
            createdAt: Date;
            message: string | null;
            action: import(".prisma/client").$Enums.SwipeAction;
            targetUserId: string;
            swiperUserId: string;
        };
        match: {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            createdAt: Date;
            updatedAt: Date;
            matchedAt: Date;
            userBId: string;
            userAId: string;
        };
        isNewMatch: boolean;
    }>;
    getMySwipes(userId: string): Promise<{
        id: string;
        createdAt: Date;
        message: string | null;
        action: import(".prisma/client").$Enums.SwipeAction;
        targetUserId: string;
        swiperUserId: string;
    }[]>;
    private notifyNewMatch;
}
