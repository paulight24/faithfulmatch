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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const chat_gateway_1 = require("./chat.gateway");
const notifications_service_1 = require("../notifications/notifications.service");
const BOT_REPLIES = [
    'Haha that made me smile! 😊',
    'Aww, that\'s so sweet of you to say! 🙏',
    'I love that! Tell me more about yourself.',
    'That\'s really interesting! I\'ve been thinking about that too.',
    'Ha! You have a great sense of humor 😄',
    'I\'d love to know more. What\'s your favorite Bible verse?',
    'Honestly, same! Faith really is everything to me ❤️',
    'That\'s beautiful. God really does work in mysterious ways.',
    'You seem like someone who really walks the talk. I love that.',
    'I appreciate your honesty. This is refreshing 💜',
    'Wow, I didn\'t expect to connect this quickly! 😊',
    'You have no idea how much I needed to hear that today. Thank you!',
];
const PAGE_SIZE = 30;
const PHONE_REGEX = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
function containsContactInfo(text) {
    return PHONE_REGEX.test(text) || EMAIL_REGEX.test(text);
}
let MessagesService = class MessagesService {
    constructor(prisma, gateway, notifications) {
        this.prisma = prisma;
        this.gateway = gateway;
        this.notifications = notifications;
    }
    async getAuthorizedConversation(userId, conversationId) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { match: { select: { userAId: true, userBId: true, status: true } } },
        });
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found.');
        const { userAId, userBId, status } = conversation.match;
        if (userId !== userAId && userId !== userBId) {
            throw new common_1.ForbiddenException('Access denied.');
        }
        if (status !== client_1.MatchStatus.ACTIVE) {
            throw new common_1.BadRequestException('This conversation is no longer active.');
        }
        return conversation;
    }
    async sendMessage(userId, conversationId, dto) {
        const conversation = await this.getAuthorizedConversation(userId, conversationId);
        if (containsContactInfo(dto.content)) {
            throw new common_1.BadRequestException('Sharing phone numbers or email addresses is not allowed. Keep conversations safe within the app.');
        }
        const message = await this.prisma.message.create({
            data: {
                conversationId,
                senderUserId: userId,
                content: dto.content.trim(),
            },
            select: {
                id: true,
                conversationId: true,
                senderUserId: true,
                content: true,
                messageType: true,
                readAt: true,
                createdAt: true,
            },
        });
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { lastMessageAt: message.createdAt },
        });
        const recipientUserId = conversation.match.userAId === userId ? conversation.match.userBId : conversation.match.userAId;
        void this.notifyNewMessage(recipientUserId, userId, conversationId, message.content);
        void this.maybeSendBotReply(userId, conversationId);
        return message;
    }
    async notifyNewMessage(recipientUserId, senderUserId, conversationId, content) {
        try {
            if (!this.notifications)
                return;
            const sender = await this.prisma.profile.findUnique({
                where: { userId: senderUserId },
                select: { firstName: true },
            });
            const senderName = sender?.firstName || 'Someone';
            await this.notifications.create(recipientUserId, 'NEW_MESSAGE', senderName, content.length > 120 ? `${content.slice(0, 117)}...` : content, { conversationId, senderUserId });
        }
        catch {
        }
    }
    async maybeSendBotReply(senderUserId, conversationId) {
        try {
            const conversation = await this.prisma.conversation.findUnique({
                where: { id: conversationId },
                include: {
                    match: {
                        select: {
                            userAId: true, userBId: true,
                            userA: { select: { email: true } },
                            userB: { select: { email: true } },
                        },
                    },
                },
            });
            if (!conversation)
                return;
            const { userAId, userBId, userA, userB } = conversation.match;
            const botUserId = userAId === senderUserId ? userBId : userAId;
            const botUserEmail = userAId === senderUserId ? userB.email : userA.email;
            if (!botUserEmail.endsWith('@seed.fm'))
                return;
            const delayMs = 4000 + Math.floor(Math.random() * 10000);
            const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            const botMessage = await this.prisma.message.create({
                data: { conversationId, senderUserId: botUserId, content: reply },
                select: {
                    id: true, conversationId: true, senderUserId: true,
                    content: true, messageType: true, readAt: true, createdAt: true,
                },
            });
            await this.prisma.conversation.update({
                where: { id: conversationId },
                data: { lastMessageAt: botMessage.createdAt },
            });
            if (this.gateway) {
                this.gateway.pushToUser(senderUserId, 'new_message', botMessage);
            }
            void this.notifyNewMessage(senderUserId, botUserId, conversationId, botMessage.content);
        }
        catch {
        }
    }
    async getMessages(userId, conversationId, cursor) {
        await this.getAuthorizedConversation(userId, conversationId);
        const messages = await this.prisma.message.findMany({
            where: { conversationId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: PAGE_SIZE,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
            select: {
                id: true,
                senderUserId: true,
                content: true,
                messageType: true,
                readAt: true,
                createdAt: true,
            },
        });
        return {
            messages,
            nextCursor: messages.length === PAGE_SIZE ? messages[messages.length - 1].id : null,
        };
    }
    async markRead(userId, conversationId) {
        await this.getAuthorizedConversation(userId, conversationId);
        const now = new Date();
        await this.prisma.message.updateMany({
            where: {
                conversationId,
                senderUserId: { not: userId },
                readAt: null,
                deletedAt: null,
            },
            data: { readAt: now },
        });
        return { readAt: now };
    }
    async deleteMessage(userId, messageId) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message)
            throw new common_1.NotFoundException('Message not found.');
        if (message.senderUserId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own messages.');
        }
        if (message.deletedAt)
            throw new common_1.BadRequestException('Message already deleted.');
        await this.prisma.message.update({
            where: { id: messageId },
            data: { deletedAt: new Date() },
        });
        return { message: 'Message deleted.' };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_gateway_1.ChatGateway))),
    __param(2, (0, common_1.Optional)()),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_service_1.NotificationsService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chat_gateway_1.ChatGateway,
        notifications_service_1.NotificationsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map