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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const ai_service_1 = require("./ai.service");
const update_ai_memory_dto_1 = require("./dto/update-ai-memory.dto");
const suggest_reply_dto_1 = require("./dto/suggest-reply.dto");
const analyze_photo_dto_1 = require("./dto/analyze-photo.dto");
const suggest_opener_dto_1 = require("./dto/suggest-opener.dto");
let AiController = class AiController {
    constructor(ai) {
        this.ai = ai;
    }
    getMemory(user) {
        return this.ai.getMemory(user.id);
    }
    updateMemory(user, dto) {
        return this.ai.updateMemory(user.id, dto);
    }
    suggestReply(user, dto) {
        return this.ai.suggestReply(user.id, dto.conversationId);
    }
    suggestOpener(user, dto) {
        return this.ai.suggestOpener(user.id, dto.targetUserId);
    }
    analyzeProfile(user) {
        return this.ai.analyzeProfile(user.id);
    }
    getLatestProfileAnalysis(user) {
        return this.ai.getLatestProfileAnalysis(user.id);
    }
    analyzePhoto(user, dto) {
        return this.ai.analyzePhoto(user.id, dto.photoId);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('memory/me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getMemory", null);
__decorate([
    (0, common_1.Put)('memory/me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_ai_memory_dto_1.UpdateAiMemoryDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "updateMemory", null);
__decorate([
    (0, common_1.Post)('copilot/suggest-reply'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, suggest_reply_dto_1.SuggestReplyDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "suggestReply", null);
__decorate([
    (0, common_1.Post)('copilot/suggest-opener'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, suggest_opener_dto_1.SuggestOpenerDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "suggestOpener", null);
__decorate([
    (0, common_1.Post)('profile/analyze'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "analyzeProfile", null);
__decorate([
    (0, common_1.Get)('profile/analyze/latest'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getLatestProfileAnalysis", null);
__decorate([
    (0, common_1.Post)('photos/analyze'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analyze_photo_dto_1.AnalyzePhotoDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "analyzePhoto", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map