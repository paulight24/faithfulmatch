import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { RequestUser } from '../../common/decorators/current-user.decorator';
export declare class MessagesController {
    private readonly messages;
    constructor(messages: MessagesService);
    send(user: RequestUser, conversationId: string, dto: SendMessageDto): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        messageType: import(".prisma/client").$Enums.MessageType;
        readAt: Date;
        conversationId: string;
        senderUserId: string;
    }>;
    list(user: RequestUser, conversationId: string, cursor?: string): Promise<{
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
    markRead(user: RequestUser, conversationId: string): Promise<{
        readAt: Date;
    }>;
    delete(user: RequestUser, messageId: string): Promise<{
        message: string;
    }>;
}
