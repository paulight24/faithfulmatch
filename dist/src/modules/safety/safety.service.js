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
exports.SafetyService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let SafetyService = class SafetyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReport(reporterUserId, dto) {
        if (reporterUserId === dto.reportedUserId) {
            throw new common_1.BadRequestException('You cannot report yourself.');
        }
        const target = await this.prisma.user.findUnique({
            where: { id: dto.reportedUserId },
            select: { id: true },
        });
        if (!target)
            throw new common_1.NotFoundException('User not found.');
        const existing = await this.prisma.report.findFirst({
            where: {
                reporterUserId,
                reportedUserId: dto.reportedUserId,
                status: { in: ['PENDING', 'REVIEWING'] },
            },
        });
        if (existing) {
            return { message: 'Your report has been received and is under review.' };
        }
        await this.prisma.report.create({
            data: {
                reporterUserId,
                reportedUserId: dto.reportedUserId,
                reason: dto.reason,
                details: dto.details,
                messageId: dto.messageId,
            },
        });
        return { message: 'Report submitted. Thank you for helping keep our community safe.' };
    }
    async blockUser(blockerUserId, dto) {
        if (blockerUserId === dto.blockedUserId) {
            throw new common_1.BadRequestException('You cannot block yourself.');
        }
        const target = await this.prisma.user.findUnique({
            where: { id: dto.blockedUserId },
            select: { id: true },
        });
        if (!target)
            throw new common_1.NotFoundException('User not found.');
        const existing = await this.prisma.block.findUnique({
            where: {
                blockerUserId_blockedUserId: {
                    blockerUserId,
                    blockedUserId: dto.blockedUserId,
                },
            },
        });
        if (existing)
            throw new common_1.ConflictException('User is already blocked.');
        await this.prisma.$transaction(async (tx) => {
            await tx.block.create({
                data: {
                    blockerUserId,
                    blockedUserId: dto.blockedUserId,
                    reason: dto.reason,
                },
            });
            const match = await tx.match.findFirst({
                where: {
                    OR: [
                        { userAId: blockerUserId, userBId: dto.blockedUserId },
                        { userAId: dto.blockedUserId, userBId: blockerUserId },
                    ],
                    status: client_1.MatchStatus.ACTIVE,
                },
            });
            if (match) {
                await tx.match.update({
                    where: { id: match.id },
                    data: { status: client_1.MatchStatus.BLOCKED },
                });
            }
        });
        return { message: 'User blocked. They will no longer appear in your discovery or matches.' };
    }
    async unblockUser(blockerUserId, blockedUserId) {
        const block = await this.prisma.block.findUnique({
            where: {
                blockerUserId_blockedUserId: { blockerUserId, blockedUserId },
            },
        });
        if (!block)
            throw new common_1.NotFoundException('Block not found.');
        await this.prisma.block.delete({
            where: { blockerUserId_blockedUserId: { blockerUserId, blockedUserId } },
        });
        return { message: 'User unblocked.' };
    }
    async getMyBlocks(userId) {
        const blocks = await this.prisma.block.findMany({
            where: { blockerUserId: userId },
            include: {
                blocked: {
                    select: {
                        id: true,
                        profile: { select: { firstName: true, displayName: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return blocks.map((b) => ({
            blockedUserId: b.blockedUserId,
            blockedAt: b.createdAt,
            reason: b.reason,
            firstName: b.blocked.profile?.firstName ?? null,
            displayName: b.blocked.profile?.displayName ?? null,
        }));
    }
};
exports.SafetyService = SafetyService;
exports.SafetyService = SafetyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SafetyService);
//# sourceMappingURL=safety.service.js.map