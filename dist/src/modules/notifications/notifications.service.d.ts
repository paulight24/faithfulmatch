import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatGateway } from '../messages/chat.gateway';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';
import { WebPushProvider } from '../../infrastructure/push/webpush.provider';
import { FcmProvider } from '../../infrastructure/push/fcm.provider';
export declare class NotificationsService {
    private readonly prisma;
    private readonly pushProvider;
    private readonly fcmProvider;
    private readonly gateway;
    constructor(prisma: PrismaService, pushProvider: WebPushProvider, fcmProvider: FcmProvider, gateway: ChatGateway | null);
    create(userId: string, type: string, title: string, body: string, data?: Prisma.InputJsonValue): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        data: Prisma.JsonValue | null;
        userId: string;
        readAt: Date | null;
        type: string;
        channel: string;
        title: string;
        body: string;
        sentAt: Date | null;
    }>;
    private sendWebPush;
    private sendFcmPush;
    list(userId: string, cursor?: string): Promise<{
        notifications: {
            id: string;
            status: string;
            createdAt: Date;
            data: Prisma.JsonValue | null;
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
    unreadCount(userId: string): Promise<{
        count: number;
    }>;
    markRead(userId: string, notificationId: string): Promise<{
        message: string;
    }>;
    markAllRead(userId: string): Promise<{
        message: string;
    }>;
    registerDeviceToken(userId: string, dto: RegisterDeviceTokenDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        token: string;
        provider: string;
        platform: string;
        lastSeenAt: Date | null;
    }>;
    removeDeviceToken(userId: string, token: string): Promise<{
        message: string;
    }>;
}
