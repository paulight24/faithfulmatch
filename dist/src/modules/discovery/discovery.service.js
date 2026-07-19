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
exports.DiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const geocode_zip_util_1 = require("../profiles/geocode-zip.util");
let DiscoveryService = class DiscoveryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFeed(userId, query) {
        const limit = query.limit ?? 20;
        const [prefs, myProfile] = await Promise.all([
            this.prisma.preference.findUnique({ where: { userId } }),
            this.prisma.profile.findUnique({ where: { userId } }),
        ]);
        const alreadySwiped = await this.prisma.swipe.findMany({
            where: { swiperUserId: userId },
            select: { targetUserId: true },
        });
        const swipedIds = alreadySwiped.map((s) => s.targetUserId);
        const blocks = await this.prisma.block.findMany({
            where: {
                OR: [{ blockerUserId: userId }, { blockedUserId: userId }],
            },
            select: { blockerUserId: true, blockedUserId: true },
        });
        const blockedIds = blocks
            .flatMap((b) => [b.blockerUserId, b.blockedUserId])
            .filter((id) => id !== userId);
        const excludeIds = [...new Set([userId, ...swipedIds, ...blockedIds])];
        const minAge = prefs?.minAge ?? 18;
        const maxAge = prefs?.maxAge ?? 99;
        const today = new Date();
        const maxBirthday = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
        const minBirthday = new Date(today.getFullYear() - maxAge - 1, today.getMonth(), today.getDate());
        const genderFilter = prefs?.genderPreference
            ? ({ gender: prefs.genderPreference })
            : {};
        const candidates = await this.prisma.profile.findMany({
            where: {
                userId: { notIn: excludeIds },
                visibilityStatus: client_1.ProfileVisibilityStatus.VISIBLE,
                profileCompletionPercent: { gte: 80 },
                ...(genderFilter),
                ...(myProfile?.birthday
                    ? { birthday: { gte: minBirthday, lte: maxBirthday } }
                    : {}),
                user: { status: client_1.UserStatus.ACTIVE },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        status: true,
                        emailVerifiedAt: true,
                        profilePhotos: {
                            where: { moderationStatus: client_1.PhotoModerationStatus.APPROVED },
                            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
                            take: 6,
                            select: { id: true, url: true, isPrimary: true },
                        },
                    },
                },
            },
            orderBy: [{ profileCompletionPercent: 'desc' }, { updatedAt: 'desc' }],
            take: limit + 10,
            ...(query.cursor ? { skip: 1, cursor: { id: query.cursor } } : {}),
        });
        let filtered = candidates.filter((p) => p.user.profilePhotos.length > 0);
        if (myProfile?.latitudeApprox != null && myProfile?.longitudeApprox != null && prefs?.maxDistanceMiles) {
            const myLat = myProfile.latitudeApprox;
            const myLng = myProfile.longitudeApprox;
            const maxMiles = prefs.maxDistanceMiles;
            filtered = filtered.filter((p) => {
                if (p.latitudeApprox == null || p.longitudeApprox == null)
                    return true;
                return (0, geocode_zip_util_1.haversineMiles)(myLat, myLng, p.latitudeApprox, p.longitudeApprox) <= maxMiles;
            });
        }
        const now = new Date();
        const boosted = filtered.filter((p) => p.boostActiveUntil && p.boostActiveUntil > now);
        const rest = filtered.filter((p) => !p.boostActiveUntil || p.boostActiveUntil <= now);
        filtered = [...boosted, ...rest].slice(0, limit);
        return {
            profiles: filtered.map((p) => this.serializeProfile(p)),
            nextCursor: filtered.length === limit ? filtered[filtered.length - 1].id : null,
            remaining: filtered.length,
        };
    }
    async getLikesReceived(userId) {
        const [matches, blocks, incomingLikes] = await Promise.all([
            this.prisma.match.findMany({
                where: { OR: [{ userAId: userId }, { userBId: userId }] },
                select: { userAId: true, userBId: true },
            }),
            this.prisma.block.findMany({
                where: { OR: [{ blockerUserId: userId }, { blockedUserId: userId }] },
                select: { blockerUserId: true, blockedUserId: true },
            }),
            this.prisma.swipe.findMany({
                where: {
                    targetUserId: userId,
                    action: { in: ['LIKE', 'SUPER_LIKE'] },
                },
                orderBy: { createdAt: 'desc' },
                select: {
                    swiperUserId: true,
                    action: true,
                    createdAt: true,
                },
            }),
        ]);
        const matchedIds = new Set(matches.flatMap((m) => [m.userAId, m.userBId]).filter((id) => id !== userId));
        const blockedIds = new Set(blocks.flatMap((b) => [b.blockerUserId, b.blockedUserId]).filter((id) => id !== userId));
        const eligible = incomingLikes.filter((s) => !matchedIds.has(s.swiperUserId) && !blockedIds.has(s.swiperUserId));
        const likerIds = eligible.map((s) => s.swiperUserId);
        const profiles = await this.prisma.profile.findMany({
            where: { userId: { in: likerIds }, visibilityStatus: client_1.ProfileVisibilityStatus.VISIBLE },
            include: {
                user: {
                    select: {
                        emailVerifiedAt: true,
                        profilePhotos: {
                            where: { moderationStatus: client_1.PhotoModerationStatus.APPROVED },
                            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
                            take: 6,
                            select: { id: true, url: true, isPrimary: true },
                        },
                    },
                },
            },
        });
        const profileByUserId = new Map(profiles.map((p) => [p.userId, p]));
        const results = eligible
            .map((s) => {
            const p = profileByUserId.get(s.swiperUserId);
            if (!p || p.user.profilePhotos.length === 0)
                return null;
            return {
                ...this.serializeProfile(p),
                primaryPhotoUrl: p.user.profilePhotos[0].url,
                isSuperLike: s.action === 'SUPER_LIKE',
                likedAt: s.createdAt,
            };
        })
            .filter((r) => r !== null);
        return { likes: results, count: results.length };
    }
    serializeProfile(p) {
        const age = p.birthday
            ? Math.floor((Date.now() - new Date(p.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
            : null;
        return {
            profileId: p.id,
            userId: p.userId,
            firstName: p.firstName,
            displayName: p.displayName,
            age,
            gender: p.gender,
            denomination: p.denomination,
            churchInvolvement: p.churchInvolvement,
            faithLevel: p.faithLevel,
            marriageIntent: p.marriageIntent,
            bio: p.bio,
            occupation: p.occupation,
            city: p.city,
            state: p.state,
            emailVerified: !!p.user.emailVerifiedAt,
            profileCompletionPercent: p.profileCompletionPercent,
            photos: p.user.profilePhotos,
        };
    }
};
exports.DiscoveryService = DiscoveryService;
exports.DiscoveryService = DiscoveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiscoveryService);
//# sourceMappingURL=discovery.service.js.map