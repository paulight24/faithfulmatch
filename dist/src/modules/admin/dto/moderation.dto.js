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
exports.RejectPhotoDto = exports.ModerationActionDto = exports.UpdateReportDto = exports.MODERATION_ACTIONS = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
exports.MODERATION_ACTIONS = ['WARN', 'SUSPEND_7D', 'SUSPEND_30D', 'BAN', 'CLEAR'];
class UpdateReportDto {
}
exports.UpdateReportDto = UpdateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ReportStatus }),
    (0, class_validator_1.IsEnum)(client_1.ReportStatus),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "notes", void 0);
class ModerationActionDto {
}
exports.ModerationActionDto = ModerationActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target user ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ModerationActionDto.prototype, "targetUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: exports.MODERATION_ACTIONS }),
    (0, class_validator_1.IsIn)(exports.MODERATION_ACTIONS),
    __metadata("design:type", String)
], ModerationActionDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModerationActionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report ID this action relates to' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModerationActionDto.prototype, "reportId", void 0);
class RejectPhotoDto {
}
exports.RejectPhotoDto = RejectPhotoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Photo does not show your face clearly.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RejectPhotoDto.prototype, "reason", void 0);
//# sourceMappingURL=moderation.dto.js.map