import { PrismaService } from '../../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatGateway } from './chat.gateway';
import { NotificationsService } from '../notifications/notifications.service';
export declare class MessagesService {
    private readonly prisma;
    private readonly gateway;
    private readonly notifications;
    constructor(prisma: PrismaService, gateway: ChatGateway | null, notifications: NotificationsService | null);
    private getAuthorizedConversation;
    sendMessage(userId: string, conversationId: string, dto: SendMessageDto): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        messageType: import(".prisma/client").$Enums.MessageType;
        readAt: Date;
        conversationId: string;
        senderUserId: string;
    }>;
    private notifyNewMessage;
    private maybeSendBotReply;
    getMessages(userId: string, conversationId: string, cursor?: string): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            content: string;
            messageType: import(".prisma/client").$Enums.MessageType;
            readAt: Date;
            senderUserId: string;
        }[];
        nextCursor: string;
    }>;
    markRead(userId: string, conversationId: string): Promise<{
        readAt: Date;
    }>;
    deleteMessage(userId: string, messageId: string): Promise<{
        message: string;
    }>;
}
