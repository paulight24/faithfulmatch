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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listReports(status, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};
        const [reports, total] = await Promise.all([
            this.prisma.report.findMany({
                where,
                include: {
                    reporter: {
                        select: { id: true, email: true, profile: { select: { firstName: true } } },
                    },
                    reported: {
                        select: {
                            id: true, email: true, status: true,
                            profile: { select: { firstName: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.report.count({ where }),
        ]);
        return { reports, total, page, pages: Math.ceil(total / limit) };
    }
    async updateReport(adminId, reportId, dto) {
        const report = await this.prisma.report.findUnique({ where: { id: reportId } });
        if (!report)
            throw new common_1.NotFoundException('Report not found.');
        return this.prisma.report.update({
            where: { id: reportId },
            data: { status: dto.status, reviewedAt: new Date() },
        });
    }
    async applyModerationAction(adminId, dto) {
        const target = await this.prisma.user.findUnique({
            where: { id: dto.targetUserId },
            select: { id: true, status: true },
        });
        if (!target)
            throw new common_1.NotFoundException('User not found.');
        let newStatus = null;
        let suspendedUntil = null;
        switch (dto.action) {
            case 'WARN':
                break;
            case 'SUSPEND_7D':
                newStatus = client_1.UserStatus.SUSPENDED;
                suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                break;
            case 'SUSPEND_30D':
                newStatus = client_1.UserStatus.SUSPENDED;
                suspendedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                break;
            case 'BAN':
                newStatus = client_1.UserStatus.SUSPENDED;
                break;
            case 'CLEAR':
                newStatus = client_1.UserStatus.ACTIVE;
                break;
        }
        await this.prisma.$transaction(async (tx) => {
            if (newStatus) {
                await tx.user.update({
                    where: { id: dto.targetUserId },
                    data: { status: newStatus },
                });
            }
            await tx.moderationAction.create({
                data: {
                    adminUserId: adminId,
                    targetUserId: dto.targetUserId,
                    reportId: dto.reportId ?? null,
                    action: dto.action,
                    reason: dto.reason,
                },
            });
            if (dto.reportId) {
                await tx.report.update({
                    where: { id: dto.reportId },
                    data: { status: client_1.ReportStatus.RESOLVED, reviewedAt: new Date() },
                });
            }
        });
        return {
            message: `Action '${dto.action}' applied to user ${dto.targetUserId}.`,
            newStatus,
            suspendedUntil,
        };
    }
    async listUsers(search, status, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = {
            ...(status ? { status } : {}),
            ...(search
                ? {
                    OR: [
                        { email: { contains: search } },
                        { profile: { firstName: { contains: search } } },
                    ],
                }
                : {}),
        };
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    profile: {
                        select: {
                            firstName: true,
                            profileCompletionPercent: true,
                            visibilityStatus: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);
        return { users, total, page, pages: Math.ceil(total / limit) };
    }
    async getPendingPhotos(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [photos, total] = await Promise.all([
            this.prisma.profilePhoto.findMany({
                where: { moderationStatus: client_1.PhotoModerationStatus.PENDING },
                include: {
                    user: {
                        select: {
                            id: true, email: true,
                            profile: { select: { firstName: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'asc' },
                skip,
                take: limit,
            }),
            this.prisma.profilePhoto.count({
                where: { moderationStatus: client_1.PhotoModerationStatus.PENDING },
            }),
        ]);
        return { photos, total, page, pages: Math.ceil(total / limit) };
    }
    async approvePhoto(adminId, photoId) {
        const photo = await this.prisma.profilePhoto.findUnique({ where: { id: photoId } });
        if (!photo)
            throw new common_1.NotFoundException('Photo not found.');
        if (photo.moderationStatus !== client_1.PhotoModerationStatus.PENDING) {
            throw new common_1.BadRequestException('Photo is not in PENDING state.');
        }
        const updated = await this.prisma.profilePhoto.update({
            where: { id: photoId },
            data: { moderationStatus: client_1.PhotoModerationStatus.APPROVED },
        });
        await this.refreshProfileCompletion(photo.userId);
        return updated;
    }
    async rejectPhoto(adminId, photoId, dto) {
        const photo = await this.prisma.profilePhoto.findUnique({ where: { id: photoId } });
        if (!photo)
            throw new common_1.NotFoundException('Photo not found.');
        const updated = await this.prisma.profilePhoto.update({
            where: { id: photoId },
            data: {
                moderationStatus: client_1.PhotoModerationStatus.REJECTED,
                rejectionReason: dto.reason,
                isPrimary: false,
            },
        });
        await this.refreshProfileCompletion(photo.userId);
        return updated;
    }
    async getDashboardStats() {
        const [totalUsers, activeUsers, pendingReports, pendingPhotos, totalMatches,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { status: client_1.UserStatus.ACTIVE } }),
            this.prisma.report.count({ where: { status: client_1.ReportStatus.PENDING } }),
            this.prisma.profilePhoto.count({ where: { moderationStatus: client_1.PhotoModerationStatus.PENDING } }),
            this.prisma.match.count(),
        ]);
        return { totalUsers, activeUsers, pendingReports, pendingPhotos, totalMatches };
    }
    async refreshProfileCompletion(userId) {
        const { calculateProfileCompletion } = await Promise.resolve().then(() => require('../profiles/profile-completion.util'));
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            return;
        const approvedCount = await this.prisma.profilePhoto.count({
            where: { userId, moderationStatus: client_1.PhotoModerationStatus.APPROVED },
        });
        const { percent } = calculateProfileCompletion(profile, approvedCount);
        await this.prisma.profile.update({
            where: { userId },
            data: { profileCompletionPercent: percent },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map