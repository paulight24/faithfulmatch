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
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let MatchesService = class MatchesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyMatches(userId) {
        const matches = await this.prisma.match.findMany({
            where: {
                OR: [{ userAId: userId }, { userBId: userId }],
                status: client_1.MatchStatus.ACTIVE,
            },
            include: {
                userA: {
                    select: {
                        id: true,
                        profile: { select: { firstName: true, displayName: true, city: true, state: true } },
                        profilePhotos: {
                            where: { isPrimary: true, moderationStatus: client_1.PhotoModerationStatus.APPROVED },
                            take: 1,
                            select: { url: true },
                        },
                    },
                },
                userB: {
                    select: {
                        id: true,
                        profile: { select: { firstName: true, displayName: true, city: true, state: true } },
                        profilePhotos: {
                            where: { isPrimary: true, moderationStatus: client_1.PhotoModerationStatus.APPROVED },
                            take: 1,
                            select: { url: true },
                        },
                    },
                },
                conversation: {
                    select: {
                        id: true,
                        lastMessageAt: true,
                        messages: {
                            orderBy: { createdAt: 'desc' },
                            take: 1,
                            select: { content: true, createdAt: true, senderUserId: true },
                        },
                    },
                },
            },
            orderBy: { matchedAt: 'desc' },
        });
        return matches.map((m) => {
            const otherUser = m.userAId === userId ? m.userB : m.userA;
            const lastMsg = m.conversation?.messages?.[0] ?? null;
            return {
                matchId: m.id,
                matchedAt: m.matchedAt,
                status: m.status,
                conversationId: m.conversation?.id ?? null,
                lastMessageAt: m.conversation?.lastMessageAt ?? null,
                lastMessage: lastMsg
                    ? {
                        content: lastMsg.content,
                        senderId: lastMsg.senderUserId,
                        sentAt: lastMsg.createdAt,
                    }
                    : null,
                profile: {
                    userId: otherUser.id,
                    firstName: otherUser.profile?.firstName ?? null,
                    displayName: otherUser.profile?.displayName ?? null,
                    city: otherUser.profile?.city ?? null,
                    state: otherUser.profile?.state ?? null,
                    primaryPhotoUrl: otherUser.profilePhotos?.[0]?.url ?? null,
                },
            };
        });
    }
    async getMatchDetail(userId, matchId) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: {
                userA: {
                    select: {
                        id: true,
                        profile: true,
                        profilePhotos: {
                            where: { moderationStatus: client_1.PhotoModerationStatus.APPROVED },
                            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
                            select: { id: true, url: true, isPrimary: true },
                        },
                    },
                },
                userB: {
                    select: {
                        id: true,
                        profile: true,
                        profilePhotos: {
                            where: { moderationStatus: client_1.PhotoModerationStatus.APPROVED },
                            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
                            select: { id: true, url: true, isPrimary: true },
                        },
                    },
                },
                conversation: { select: { id: true } },
            },
        });
        if (!match)
            throw new common_1.NotFoundException('Match not found.');
        if (match.userAId !== userId && match.userBId !== userId) {
            throw new common_1.ForbiddenException('Access denied.');
        }
        const otherUser = match.userAId === userId ? match.userB : match.userA;
        return {
            matchId: match.id,
            matchedAt: match.matchedAt,
            status: match.status,
            conversationId: match.conversation?.id ?? null,
            profile: {
                userId: otherUser.id,
                ...otherUser.profile,
                photos: otherUser.profilePhotos,
            },
        };
    }
    async startConversation(userId, matchId) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: { conversation: { select: { id: true } } },
        });
        if (!match)
            throw new common_1.NotFoundException('Match not found.');
        if (match.userAId !== userId && match.userBId !== userId) {
            throw new common_1.ForbiddenException('Access denied.');
        }
        if (match.conversation) {
            return { conversationId: match.conversation.id };
        }
        const conversation = await this.prisma.conversation.create({
            data: { matchId },
            select: { id: true },
        });
        return { conversationId: conversation.id };
    }
    async unmatch(userId, matchId) {
        const match = await this.prisma.match.findUnique({ where: { id: matchId } });
        if (!match)
            throw new common_1.NotFoundException('Match not found.');
        if (match.userAId !== userId && match.userBId !== userId) {
            throw new common_1.ForbiddenException('Access denied.');
        }
        await this.prisma.match.update({
            where: { id: matchId },
            data: { status: client_1.MatchStatus.UNMATCHED },
        });
        return { message: 'Unmatched successfully.' };
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map