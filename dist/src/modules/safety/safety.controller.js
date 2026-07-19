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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const safety_service_1 = require("./safety.service");
const report_dto_1 = require("./dto/report.dto");
const block_dto_1 = require("./dto/block.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let SafetyController = class SafetyController {
    constructor(safety) {
        this.safety = safety;
    }
    report(user, dto) {
        return this.safety.createReport(user.id, dto);
    }
    block(user, dto) {
        return this.safety.blockUser(user.id, dto);
    }
    unblock(user, blockedUserId) {
        return this.safety.unblockUser(user.id, blockedUserId);
    }
    myBlocks(user) {
        return this.safety.getMyBlocks(user.id);
    }
};
exports.SafetyController = SafetyController;
__decorate([
    (0, common_1.Post)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Report a user or message' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, report_dto_1.CreateReportDto]),
    __metadata("design:returntype", void 0)
], SafetyController.prototype, "report", null);
__decorate([
    (0, common_1.Post)('blocks'),
    (0, swagger_1.ApiOperation)({ summary: 'Block a user (removes from discovery + unmatches)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, block_dto_1.CreateBlockDto]),
    __metadata("design:returntype", void 0)
], SafetyController.prototype, "block", null);
__decorate([
    (0, common_1.Delete)('blocks/:blockedUserId'),
    (0, swagger_1.ApiOperation)({ summary: 'Unblock a previously blocked user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('blockedUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SafetyController.prototype, "unblock", null);
__decorate([
    (0, common_1.Get)('blocks'),
    (0, swagger_1.ApiOperation)({ summary: 'List users you have blocked' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SafetyController.prototype, "myBlocks", null);
exports.SafetyController = SafetyController = __decorate([
    (0, swagger_1.ApiTags)('Safety'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('safety'),
    __metadata("design:paramtypes", [safety_service_1.SafetyService])
], SafetyController);
//# sourceMappingURL=safety.controller.js.map