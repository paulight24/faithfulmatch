import { SwipesService } from './swipes.service';
import { RecordSwipeDto } from './dto/record-swipe.dto';
import { RequestUser } from '../../common/decorators/current-user.decorator';
export declare class SwipesController {
    private readonly swipes;
    constructor(swipes: SwipesService);
    recordSwipe(user: RequestUser, dto: RecordSwipeDto): Promise<{
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
    getMySwipes(user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        message: string | null;
        action: import(".prisma/client").$Enums.SwipeAction;
        targetUserId: string;
        swiperUserId: string;
    }[]>;
}
