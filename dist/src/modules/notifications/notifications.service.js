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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const chat_gateway_1 = require("../messages/chat.gateway");
const webpush_provider_1 = require("../../infrastructure/push/webpush.provider");
const fcm_provider_1 = require("../../infrastructure/push/fcm.provider");
const PAGE_SIZE = 30;
let NotificationsService = class NotificationsService {
    constructor(prisma, pushProvider, fcmProvider, gateway) {
        this.prisma = prisma;
        this.pushProvider = pushProvider;
        this.fcmProvider = fcmProvider;
        this.gateway = gateway;
    }
    async create(userId, type, title, body, data) {
        const notification = await this.prisma.notification.create({
            data: {
                userId,
                type,
                channel: 'IN_APP',
                title,
                body,
                data: data ?? client_1.Prisma.JsonNull,
                status: 'SENT',
                sentAt: new Date(),
            },
        });
        this.gateway?.pushToUser(userId, 'notification', notification);
        this.sendWebPush(userId, title, body, data).catch(() => { });
        this.sendFcmPush(userId, title, body, data).catch(() => { });
        return notification;
    }
    async sendWebPush(userId, title, body, data) {
        if (!this.pushProvider.isEnabled())
            return;
        const tokens = await this.prisma.deviceToken.findMany({
            where: { userId, provider: 'WEB_PUSH' },
        });
        await Promise.all(tokens.map(async (t) => {
            try {
                await this.pushProvider.sendPush({
                    deviceToken: t.token,
                    title,
                    body,
                    data: data,
                });
            }
            catch (err) {
                if (err instanceof webpush_provider_1.PushSubscriptionGoneError) {
                    await this.prisma.deviceToken.delete({ where: { id: t.id } }).catch(() => { });
                }
            }
        }));
    }
    async sendFcmPush(userId, title, body, data) {
        if (!this.fcmProvider.isEnabled())
            return;
        const tokens = await this.prisma.deviceToken.findMany({
            where: { userId, provider: 'FCM' },
        });
        await Promise.all(tokens.map(async (t) => {
            try {
                await this.fcmProvider.sendPush({
                    deviceToken: t.token,
                    title,
                    body,
                    data: data,
                });
            }
            catch (err) {
                if (err instanceof fcm_provider_1.FcmTokenGoneError) {
                    await this.prisma.deviceToken.delete({ where: { id: t.id } }).catch(() => { });
                }
            }
        }));
    }
    async list(userId, cursor) {
        const notifications = await this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: PAGE_SIZE,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        });
        return {
            notifications,
            nextCursor: notifications.length === PAGE_SIZE
                ? notifications[notifications.length - 1].id
                : null,
        };
    }
    async unreadCount(userId) {
        const count = await this.prisma.notification.count({
            where: { userId, readAt: null },
        });
        return { count };
    }
    async markRead(userId, notificationId) {
        await this.prisma.notification.updateMany({
            where: { id: notificationId, userId, readAt: null },
            data: { readAt: new Date() },
        });
        return { message: 'Notification marked as read.' };
    }
    async markAllRead(userId) {
        await this.prisma.notification.updateMany({
            where: { userId, readAt: null },
            data: { readAt: new Date() },
        });
        return { message: 'All notifications marked as read.' };
    }
    async registerDeviceToken(userId, dto) {
        return this.prisma.deviceToken.upsert({
            where: { provider_token: { provider: dto.provider, token: dto.token } },
            update: { userId, platform: dto.platform, lastSeenAt: new Date() },
            create: {
                userId,
                platform: dto.platform,
                provider: dto.provider,
                token: dto.token,
                lastSeenAt: new Date(),
            },
        });
    }
    async removeDeviceToken(userId, token) {
        await this.prisma.deviceToken.deleteMany({ where: { userId, token } });
        return { message: 'Device token removed.' };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Optional)()),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_gateway_1.ChatGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        webpush_provider_1.WebPushProvider,
        fcm_provider_1.FcmProvider,
        chat_gateway_1.ChatGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map