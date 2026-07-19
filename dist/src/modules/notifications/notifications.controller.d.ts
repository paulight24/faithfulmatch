import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';
export declare class NotificationsController {
    private readonly notifications;
    private readonly config;
    constructor(notifications: NotificationsService, config: ConfigService);
    getPushPublicKey(): {
        publicKey: string;
    };
    list(user: {
        id: string;
    }, cursor?: string): Promise<{
        notifications: {
            id: string;
            status: string;
            createdAt: Date;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            readAt: Date | null;
            type: string;
            channel: string;
            title: string;
            body: string;
            sentAt: Date | null;
        }[];
        nextCursor: string;
    }>;
    unreadCount(user: {
        id: string;
    }): Promise<{
        count: number;
    }>;
    markRead(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
    markAllRead(user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
    registerDeviceToken(user: {
        id: string;
    }, dto: RegisterDeviceTokenDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        token: string;
        provider: string;
        platform: string;
        lastSeenAt: Date | null;
    }>;
    removeDeviceToken(user: {
        id: string;
    }, token: string): Promise<{
        message: string;
    }>;
}
