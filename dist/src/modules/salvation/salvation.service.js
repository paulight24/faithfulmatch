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
exports.SalvationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const salvation_steps_1 = require("./salvation-steps");
let SalvationService = class SalvationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProgress(userId) {
        const progress = await this.prisma.salvationProgress.findUnique({ where: { userId } });
        const completedSteps = progress?.completedSteps ?? [];
        return {
            steps: salvation_steps_1.SALVATION_STEPS,
            completedSteps,
            startedAt: progress?.startedAt ?? null,
            completedAt: progress?.completedAt ?? null,
        };
    }
    async completeStep(userId, stepId) {
        if (!salvation_steps_1.SALVATION_STEPS.some((s) => s.id === stepId)) {
            throw new common_1.BadRequestException('Unknown step.');
        }
        const existing = await this.prisma.salvationProgress.findUnique({ where: { userId } });
        const completedSteps = new Set(existing?.completedSteps ?? []);
        completedSteps.add(stepId);
        const allDone = salvation_steps_1.SALVATION_STEPS.every((s) => completedSteps.has(s.id));
        const updated = await this.prisma.salvationProgress.upsert({
            where: { userId },
            update: {
                completedSteps: Array.from(completedSteps),
                completedAt: allDone ? new Date() : existing?.completedAt ?? null,
            },
            create: {
                userId,
                completedSteps: Array.from(completedSteps),
                completedAt: allDone ? new Date() : null,
            },
        });
        return {
            completedSteps: updated.completedSteps,
            completedAt: updated.completedAt,
        };
    }
};
exports.SalvationService = SalvationService;
exports.SalvationService = SalvationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalvationService);
//# sourceMappingURL=salvation.service.js.map