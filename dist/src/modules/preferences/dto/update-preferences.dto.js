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
exports.UpdatePreferencesDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class UpdatePreferencesDto {
}
exports.UpdatePreferencesDto = UpdatePreferencesDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25, description: 'Minimum age preference' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(80),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "minAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 40, description: 'Maximum age preference' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "maxAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100, description: 'Max distance in miles' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "maxDistanceMiles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Gender, description: 'Preferred gender of matches' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Gender),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "genderPreference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        example: ['Baptist', 'Non-Denominational'],
        description: 'Accepted denominations (empty = any)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "denominationPreferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.MarriageIntent,
        isArray: true,
        example: ['READY_NOW', 'WITHIN_ONE_YEAR'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.MarriageIntent, { each: true }),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "marriageIntentPreferences", void 0);
//# sourceMappingURL=update-preferences.dto.js.map