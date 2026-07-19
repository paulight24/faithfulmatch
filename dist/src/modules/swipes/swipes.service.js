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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwipesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let SwipesService = class SwipesService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async recordSwipe(swiperUserId, dto) {
        const { targetUserId, action } = dto;
        if (swiperUserId === targetUserId) {
            throw new common_1.BadRequestException('You cannot swipe on yourself.');
        }
        const target = await this.prisma.user.findFirst({
            where: { id: targetUserId, status: 'ACTIVE' },
            select: { id: true },
        });
        if (!target)
            throw new common_1.BadRequestException('Target user not found or inactive.');
        const block = await this.prisma.block.findFirst({
            where: {
                OR: [
                    { blockerUserId: swiperUserId, blockedUserId: targetUserId },
                    { blockerUserId: targetUserId, blockedUserId: swiperUserId },
                ],
            },
        });
        if (block)
            throw new common_1.BadRequestException('Action not permitted.');
        const existingSwipe = await this.prisma.swipe.findUnique({
            where: {
                swiperUserId_targetUserId: { swiperUserId, targetUserId },
            },
        });
        if (existingSwipe?.action === action) {
            throw new common_1.ConflictException('You have already performed this action.');
        }
        const swipe = await this.prisma.swipe.upsert({
            where: { swiperUserId_targetUserId: { swiperUserId, targetUserId } },
            update: { action, message: dto.message ?? null },
            create: { swiperUserId, targetUserId, action, message: dto.message ?? null },
        });
        if (action === client_1.SwipeAction.PASS) {
            return { swipe, match: null, isNewMatch: false };
        }
        const reciprocalSwipe = await this.prisma.swipe.findFirst({
            where: {
                swiperUserId: targetUserId,
                targetUserId: swiperUserId,
                action: { in: [client_1.SwipeAction.LIKE, client_1.SwipeAction.SUPER_LIKE] },
            },
        });
        if (!reciprocalSwipe) {
            return { swipe, match: null, isNewMatch: false };
        }
        const existingMatch = await this.prisma.match.findFirst({
            where: {
                OR: [
                    { userAId: swiperUserId, userBId: targetUserId },
                    { userAId: targetUserId, userBId: swiperUserId },
                ],
            },
        });
        if (existingMatch) {
            return { swipe, match: existingMatch, isNewMatch: false };
        }
        const [match] = await this.prisma.$transaction([
            this.prisma.match.create({
                data: {
                    userAId: swiperUserId,
                    userBId: targetUserId,
                    status: client_1.MatchStatus.ACTIVE,
                },
            }),
        ]);
        const conversation = await this.prisma.conversation.create({
            data: { matchId: match.id },
        });
        if (dto.message?.trim()) {
            await this.prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    senderUserId: swiperUserId,
                    content: dto.message.trim(),
                },
            });
        }
        void this.notifyNewMatch(swiperUserId, targetUserId);
        return { swipe, match, isNewMatch: true };
    }
    async getMySwipes(userId) {
        return this.prisma.swipe.findMany({
            where: { swiperUserId: userId },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    async notifyNewMatch(userAId, userBId) {
        try {
            const [profileA, profileB] = await Promise.all([
                this.prisma.profile.findUnique({ where: { userId: userAId }, select: { firstName: true } }),
                this.prisma.profile.findUnique({ where: { userId: userBId }, select: { firstName: true } }),
            ]);
            await Promise.all([
                this.notifications.create(userAId, 'NEW_MATCH', "It's a match!", `You and ${profileB?.firstName || 'someone'} liked each other.`, { matchedUserId: userBId }),
                this.notifications.create(userBId, 'NEW_MATCH', "It's a match!", `You and ${profileA?.firstName || 'someone'} liked each other.`, { matchedUserId: userAId }),
            ]);
        }
        catch {
        }
    }
};
exports.SwipesService = SwipesService;
exports.SwipesService = SwipesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], SwipesService);
//# sourceMappingURL=swipes.service.js.map