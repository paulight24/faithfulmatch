import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { MessagesService } from './messages.service';
interface AuthenticatedSocket extends Socket {
    userId?: string;
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messagesService;
    private readonly jwtService;
    private readonly config;
    private readonly prisma;
    server: Server;
    private readonly logger;
    constructor(messagesService: MessagesService, jwtService: JwtService, config: ConfigService, prisma: PrismaService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinConversation(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): Promise<{
        event: string;
        message: string;
        conversationId?: undefined;
    } | {
        event: string;
        conversationId: string;
        message?: undefined;
    }>;
    handleLeaveConversation(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): void;
    handleSendMessage(client: AuthenticatedSocket, data: {
        conversationId: string;
        content: string;
    }): Promise<{
        event: string;
        messageId: string;
        message?: undefined;
    } | {
        event: string;
        message: string;
        messageId?: undefined;
    }>;
    handleMarkRead(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): Promise<void>;
    handleTyping(client: AuthenticatedSocket, data: {
        conversationId: string;
        isTyping: boolean;
    }): void;
    pushToUser(userId: string, event: string, payload: unknown): void;
}
export {};
