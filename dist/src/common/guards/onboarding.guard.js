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
exports.OnboardingGuard = exports.SKIP_ONBOARDING_CHECK_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const public_decorator_1 = require("../decorators/public.decorator");
const profile_completion_util_1 = require("../../modules/profiles/profile-completion.util");
exports.SKIP_ONBOARDING_CHECK_KEY = 'skipOnboardingCheck';
let OnboardingGuard = class OnboardingGuard {
    constructor(prisma, reflector) {
        this.prisma = prisma;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const skipCheck = this.reflector.getAllAndOverride(exports.SKIP_ONBOARDING_CHECK_KEY, [context.getHandler(), context.getClass()]);
        if (skipCheck)
            return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            return true;
        const profile = await this.prisma.profile.findUnique({
            where: { userId: user.id },
        });
        if (!profile || profile.profileCompletionPercent < profile_completion_util_1.DISCOVERABLE_COMPLETION_THRESHOLD) {
            throw new common_1.ForbiddenException('Please complete your profile before accessing this feature.');
        }
        const hasApprovedPhoto = await this.prisma.profilePhoto.findFirst({
            where: { userId: user.id, moderationStatus: client_1.PhotoModerationStatus.APPROVED, isPrimary: true },
        });
        if (!hasApprovedPhoto) {
            throw new common_1.ForbiddenException('Your profile photo is pending approval. You will be notified once it is reviewed.');
        }
        return true;
    }
};
exports.OnboardingGuard = OnboardingGuard;
exports.OnboardingGuard = OnboardingGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        core_1.Reflector])
], OnboardingGuard);
//# sourceMappingURL=onboarding.guard.js.map