"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const messages_service_1 = require("./messages.service");
const send_message_dto_1 = require("./dto/send-message.dto");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(messagesService, jwtService, config, prisma) {
        this.messagesService = messagesService;
        this.jwtService = jwtService;
        this.config = config;
        this.prisma = prisma;
        this.logger = new common_1.Logger(ChatGateway_1.name);
    }
    async handleConnection(client) {
        const token = client.handshake.auth?.token ??
            client.handshake.headers?.authorization?.replace('Bearer ', '');
        if (!token) {
            client.disconnect(true);
            return;
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.config.get('jwt.accessSecret'),
            });
            client.userId = payload.sub;
            client.join(`user:${client.userId}`);
            this.logger.log(`Client connected: ${client.userId}`);
        }
        catch {
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.userId ?? client.id}`);
    }
    async handleJoinConversation(client, data) {
        if (!client.userId) {
            client.disconnect(true);
            return;
        }
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: data.conversationId },
            include: { match: { select: { userAId: true, userBId: true, status: true } } },
        });
        if (!conversation ||
            (client.userId !== conversation.match.userAId && client.userId !== conversation.match.userBId)) {
            return { event: 'error', message: 'Access denied.' };
        }
        if (conversation.match.status !== 'ACTIVE') {
            return { event: 'error', message: 'This conversation is no longer active.' };
        }
        client.join(`conv:${data.conversationId}`);
        return { event: 'joined', conversationId: data.conversationId };
    }
    handleLeaveConversation(client, data) {
        client.leave(`conv:${data.conversationId}`);
    }
    async handleSendMessage(client, data) {
        if (!client.userId) {
            client.disconnect(true);
            return;
        }
        try {
            const dto = new send_message_dto_1.SendMessageDto();
            dto.content = data.content;
            const message = await this.messagesService.sendMessage(client.userId, data.conversationId, dto);
            this.server.to(`conv:${data.conversationId}`).emit('new_message', message);
            return { event: 'message_sent', messageId: message.id };
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to send message';
            return { event: 'error', message: msg };
        }
    }
    async handleMarkRead(client, data) {
        if (!client.userId)
            return;
        try {
            const result = await this.messagesService.markRead(client.userId, data.conversationId);
            client.to(`conv:${data.conversationId}`).emit('messages_read', {
                conversationId: data.conversationId,
                readAt: result.readAt,
                readByUserId: client.userId,
            });
        }
        catch { }
    }
    handleTyping(client, data) {
        if (!client.userId)
            return;
        client.to(`conv:${data.conversationId}`).emit('typing', {
            userId: client.userId,
            isTyping: data.isTyping,
        });
    }
    pushToUser(userId, event, payload) {
        this.server.to(`user:${userId}`).emit(event, payload);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*', credentials: true },
        namespace: '/chat',
    }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => messages_service_1.MessagesService))),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map