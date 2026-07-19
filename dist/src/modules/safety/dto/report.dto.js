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
exports.CreateReportDto = exports.REPORT_REASONS = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
exports.REPORT_REASONS = [
    'INAPPROPRIATE_PHOTOS',
    'FAKE_PROFILE',
    'HARASSMENT',
    'SPAM',
    'UNDERAGE',
    'HATE_SPEECH',
    'SCAM',
    'OTHER',
];
class CreateReportDto {
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID being reported' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "reportedUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: exports.REPORT_REASONS }),
    (0, class_validator_1.IsIn)(exports.REPORT_REASONS),
    __metadata("design:type", String)
], CreateReportDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional context (optional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateReportDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Message ID if reporting a specific message' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "messageId", void 0);
//# sourceMappingURL=report.dto.js.map