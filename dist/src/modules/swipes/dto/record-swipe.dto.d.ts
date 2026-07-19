import { SwipeAction } from '@prisma/client';
export declare class RecordSwipeDto {
    targetUserId: string;
    action: SwipeAction;
    message?: string;
}
