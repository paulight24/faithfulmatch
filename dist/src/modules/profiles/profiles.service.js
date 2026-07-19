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
var ProfilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const storage_provider_interface_1 = require("../../infrastructure/storage/storage-provider.interface");
const profile_completion_util_1 = require("./profile-completion.util");
const geocode_zip_util_1 = require("./geocode-zip.util");
const ai_service_1 = require("../ai/ai.service");
const config_1 = require("@nestjs/config");
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTOS_PER_USER = 6;
let ProfilesService = ProfilesService_1 = class ProfilesService {
    constructor(prisma, storage, aiService, config) {
        this.prisma = prisma;
        this.storage = storage;
        this.aiService = aiService;
        this.config = config;
        this.storageProviderName = this.config.get('storage.provider') ?? 'local';
    }
    async getOrCreateProfile(userId) {
        let profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile) {
            profile = await this.prisma.profile.create({
                data: { userId, visibilityStatus: client_1.ProfileVisibilityStatus.DRAFT },
            });
        }
        const photos = await this.prisma.profilePhoto.findMany({
            where: { userId },
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        });
        const approvedCount = photos.filter((p) => p.moderationStatus === client_1.PhotoModerationStatus.APPROVED).length;
        const completion = (0, profile_completion_util_1.calculateProfileCompletion)(profile, approvedCount);
        return { profile, photos, completion };
    }
    async updateProfile(userId, dto) {
        const data = {};
        if (dto.firstName !== undefined)
            data['firstName'] = dto.firstName;
        if (dto.displayName !== undefined)
            data['displayName'] = dto.displayName;
        if (dto.birthday !== undefined) {
            const dob = new Date(dto.birthday);
            const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            if (age < 18)
                throw new common_1.BadRequestException('You must be at least 18 years old.');
            if (age > 100)
                throw new common_1.BadRequestException('Please enter a valid date of birth.');
            data['birthday'] = dob;
        }
        if (dto.gender !== undefined)
            data['gender'] = dto.gender;
        if (dto.denomination !== undefined)
            data['denomination'] = dto.denomination;
        if (dto.churchInvolvement !== undefined)
            data['churchInvolvement'] = dto.churchInvolvement;
        if (dto.faithLevel !== undefined)
            data['faithLevel'] = dto.faithLevel;
        if (dto.marriageIntent !== undefined)
            data['marriageIntent'] = dto.marriageIntent;
        if (dto.bio !== undefined)
            data['bio'] = dto.bio;
        if (dto.occupation !== undefined)
            data['occupation'] = dto.occupation;
        if (dto.city !== undefined)
            data['city'] = dto.city;
        if (dto.state !== undefined)
            data['state'] = dto.state;
        if (dto.country !== undefined)
            data['country'] = dto.country;
        if (dto.zip !== undefined)
            data['zip'] = dto.zip;
        if (dto.zip) {
            const coords = await (0, geocode_zip_util_1.geocodeUsZip)(dto.zip);
            if (coords) {
                data['latitudeApprox'] = coords.lat;
                data['longitudeApprox'] = coords.lng;
            }
        }
        const profile = await this.prisma.profile.upsert({
            where: { userId },
            update: data,
            create: { userId, ...data },
        });
        const approvedCount = await this.prisma.profilePhoto.count({
            where: { userId, moderationStatus: client_1.PhotoModerationStatus.APPROVED },
        });
        const completion = (0, profile_completion_util_1.calculateProfileCompletion)(profile, approvedCount);
        const visibilityStatus = completion.percent >= profile_completion_util_1.DISCOVERABLE_COMPLETION_THRESHOLD
            ? client_1.ProfileVisibilityStatus.VISIBLE
            : profile.visibilityStatus === client_1.ProfileVisibilityStatus.VISIBLE
                ? client_1.ProfileVisibilityStatus.REVIEW
                : profile.visibilityStatus;
        const updated = await this.prisma.profile.update({
            where: { userId },
            data: {
                profileCompletionPercent: completion.percent,
                visibilityStatus,
            },
        });
        return { profile: updated, completion };
    }
    async uploadPhoto(userId, file) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Only JPEG, PNG, and WebP images are allowed.');
        }
        const existingCount = await this.prisma.profilePhoto.count({ where: { userId } });
        if (existingCount >= MAX_PHOTOS_PER_USER) {
            throw new common_1.BadRequestException(`You may upload a maximum of ${MAX_PHOTOS_PER_USER} photos.`);
        }
        const result = await this.storage.uploadFile({ userId, file });
        const safety = await this.aiService.moderatePhotoSafety(result.storageKey);
        const isFirst = existingCount === 0;
        const photo = await this.prisma.profilePhoto.create({
            data: {
                userId,
                url: result.publicUrl,
                storageKey: result.storageKey,
                storageProvider: this.storageProviderName,
                mimeType: result.mimeType,
                sizeBytes: result.sizeBytes,
                sortOrder: existingCount,
                isPrimary: isFirst,
                moderationStatus: safety.flagged
                    ? client_1.PhotoModerationStatus.REJECTED
                    : client_1.PhotoModerationStatus.APPROVED,
                rejectionReason: safety.flagged ? safety.reason : null,
            },
        });
        await this.refreshCompletionScore(userId);
        return photo;
    }
    async deletePhoto(userId, photoId) {
        const photo = await this.prisma.profilePhoto.findFirst({
            where: { id: photoId, userId },
        });
        if (!photo)
            throw new common_1.NotFoundException('Photo not found.');
        await this.storage.deleteFile(photo.storageKey);
        await this.prisma.profilePhoto.delete({ where: { id: photoId } });
        if (photo.isPrimary) {
            const nextApproved = await this.prisma.profilePhoto.findFirst({
                where: { userId, moderationStatus: client_1.PhotoModerationStatus.APPROVED },
                orderBy: { sortOrder: 'asc' },
            });
            if (nextApproved) {
                await this.prisma.profilePhoto.update({
                    where: { id: nextApproved.id },
                    data: { isPrimary: true },
                });
            }
        }
        await this.refreshCompletionScore(userId);
        return { message: 'Photo deleted.' };
    }
    async setPrimaryPhoto(userId, photoId) {
        const photo = await this.prisma.profilePhoto.findFirst({
            where: { id: photoId, userId },
        });
        if (!photo)
            throw new common_1.NotFoundException('Photo not found.');
        if (photo.moderationStatus !== client_1.PhotoModerationStatus.APPROVED) {
            throw new common_1.ForbiddenException('Only approved photos can be set as primary.');
        }
        await this.prisma.$transaction([
            this.prisma.profilePhoto.updateMany({
                where: { userId },
                data: { isPrimary: false },
            }),
            this.prisma.profilePhoto.update({
                where: { id: photoId },
                data: { isPrimary: true },
            }),
        ]);
        return { message: 'Primary photo updated.' };
    }
    async approvePhoto(photoId) {
        const photo = await this.prisma.profilePhoto.update({
            where: { id: photoId },
            data: { moderationStatus: client_1.PhotoModerationStatus.APPROVED },
        });
        await this.refreshCompletionScore(photo.userId);
        return photo;
    }
    async rejectPhoto(photoId, reason) {
        const photo = await this.prisma.profilePhoto.update({
            where: { id: photoId },
            data: {
                moderationStatus: client_1.PhotoModerationStatus.REJECTED,
                rejectionReason: reason,
                isPrimary: false,
            },
        });
        await this.refreshCompletionScore(photo.userId);
        return photo;
    }
    async setVisibility(userId, visible) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found.');
        if (visible && profile.visibilityStatus === client_1.ProfileVisibilityStatus.BANNED) {
            throw new common_1.ForbiddenException('Your profile has been suspended. Please contact support.');
        }
        const newStatus = visible
            ? client_1.ProfileVisibilityStatus.VISIBLE
            : client_1.ProfileVisibilityStatus.HIDDEN;
        await this.prisma.profile.update({
            where: { userId },
            data: { visibilityStatus: newStatus },
        });
        return {
            message: visible ? 'Your profile is now visible in discovery.' : 'Your profile is hidden from discovery.',
            visibilityStatus: newStatus,
        };
    }
    async getBoostStatus(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            select: { boostActiveUntil: true, boostAvailableAt: true },
        });
        const now = new Date();
        return {
            isActive: !!profile?.boostActiveUntil && profile.boostActiveUntil > now,
            boostActiveUntil: profile?.boostActiveUntil ?? null,
            boostAvailableAt: profile?.boostAvailableAt ?? null,
        };
    }
    async activateBoost(userId) {
        const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
        if (subscription?.plan !== client_1.SubscriptionPlan.PREMIUM) {
            throw new common_1.ForbiddenException('Profile boost is a Premium feature.');
        }
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found.');
        const now = new Date();
        if (profile.boostAvailableAt && profile.boostAvailableAt > now) {
            throw new common_1.BadRequestException(`Your next boost is available on ${profile.boostAvailableAt.toISOString().slice(0, 10)}.`);
        }
        const boostActiveUntil = new Date(now.getTime() + ProfilesService_1.BOOST_DURATION_MS);
        const boostAvailableAt = new Date(now.getTime() + ProfilesService_1.BOOST_COOLDOWN_MS);
        await this.prisma.profile.update({
            where: { userId },
            data: { boostActiveUntil, boostAvailableAt },
        });
        return { isActive: true, boostActiveUntil, boostAvailableAt };
    }
    async refreshCompletionScore(userId) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            return;
        const approvedCount = await this.prisma.profilePhoto.count({
            where: { userId, moderationStatus: client_1.PhotoModerationStatus.APPROVED },
        });
        const { percent } = (0, profile_completion_util_1.calculateProfileCompletion)(profile, approvedCount);
        await this.prisma.profile.update({
            where: { userId },
            data: { profileCompletionPercent: percent },
        });
    }
};
exports.ProfilesService = ProfilesService;
ProfilesService.BOOST_DURATION_MS = 30 * 60 * 1000;
ProfilesService.BOOST_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
exports.ProfilesService = ProfilesService = ProfilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(storage_provider_interface_1.STORAGE_PROVIDER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object, ai_service_1.AiService,
        config_1.ConfigService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map