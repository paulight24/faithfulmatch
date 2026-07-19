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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const matches_service_1 = require("./matches.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const onboarding_guard_1 = require("../../common/guards/onboarding.guard");
let MatchesController = class MatchesController {
    constructor(matches) {
        this.matches = matches;
    }
    getMyMatches(user) {
        return this.matches.getMyMatches(user.id);
    }
    getMatchDetail(user, matchId) {
        return this.matches.getMatchDetail(user.id, matchId);
    }
    startConversation(user, matchId) {
        return this.matches.startConversation(user.id, matchId);
    }
    unmatch(user, matchId) {
        return this.matches.unmatch(user.id, matchId);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active matches with last message preview' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "getMyMatches", null);
__decorate([
    (0, common_1.Get)(':matchId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details for a specific match' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "getMatchDetail", null);
__decorate([
    (0, common_1.Post)(':matchId/conversation'),
    (0, swagger_1.ApiOperation)({ summary: 'Start (or get existing) conversation for a match' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "startConversation", null);
__decorate([
    (0, common_1.Delete)(':matchId'),
    (0, swagger_1.ApiOperation)({ summary: 'Unmatch (permanently removes the match)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "unmatch", null);
exports.MatchesController = MatchesController = __decorate([
    (0, swagger_1.ApiTags)('Matches'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(onboarding_guard_1.OnboardingGuard),
    (0, common_1.Controller)('matches'),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
//# sourceMappingURL=matches.controller.js.map