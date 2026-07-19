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
exports.PreferencesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let PreferencesService = class PreferencesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreate(userId) {
        const existing = await this.prisma.preference.findUnique({ where: { userId } });
        if (existing)
            return existing;
        return this.prisma.preference.create({
            data: {
                userId,
                minAge: 21,
                maxAge: 45,
                maxDistanceMiles: 100,
                denominationPreferences: client_1.Prisma.JsonNull,
                marriageIntentPreferences: client_1.Prisma.JsonNull,
            },
        });
    }
    async update(userId, dto) {
        if (dto.minAge !== undefined && dto.maxAge !== undefined && dto.minAge > dto.maxAge) {
            dto.maxAge = dto.minAge + 5;
        }
        return this.prisma.preference.upsert({
            where: { userId },
            update: {
                ...(dto.minAge !== undefined && { minAge: dto.minAge }),
                ...(dto.maxAge !== undefined && { maxAge: dto.maxAge }),
                ...(dto.maxDistanceMiles !== undefined && { maxDistanceMiles: dto.maxDistanceMiles }),
                ...(dto.genderPreference !== undefined && { genderPreference: dto.genderPreference }),
                ...(dto.denominationPreferences !== undefined && {
                    denominationPreferences: dto.denominationPreferences,
                }),
                ...(dto.marriageIntentPreferences !== undefined && {
                    marriageIntentPreferences: dto.marriageIntentPreferences,
                }),
            },
            create: {
                userId,
                minAge: dto.minAge ?? 21,
                maxAge: dto.maxAge ?? 45,
                maxDistanceMiles: dto.maxDistanceMiles ?? 100,
                genderPreference: dto.genderPreference,
                denominationPreferences: (dto.denominationPreferences ?? null),
                marriageIntentPreferences: (dto.marriageIntentPreferences ?? null),
            },
        });
    }
};
exports.PreferencesService = PreferencesService;
exports.PreferencesService = PreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PreferencesService);
//# sourceMappingURL=preferences.service.js.map