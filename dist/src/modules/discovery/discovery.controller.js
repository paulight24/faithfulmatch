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
exports.DiscoveryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const discovery_service_1 = require("./discovery.service");
const feed_query_dto_1 = require("./dto/feed-query.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const onboarding_guard_1 = require("../../common/guards/onboarding.guard");
let DiscoveryController = class DiscoveryController {
    constructor(discovery) {
        this.discovery = discovery;
    }
    getFeed(user, query) {
        return this.discovery.getFeed(user.id, query);
    }
    getLikesReceived(user) {
        return this.discovery.getLikesReceived(user.id);
    }
};
exports.DiscoveryController = DiscoveryController;
__decorate([
    (0, common_1.Get)('feed'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the next batch of profiles to swipe on' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, feed_query_dto_1.FeedQueryDto]),
    __metadata("design:returntype", void 0)
], DiscoveryController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Get)('likes-received'),
    (0, swagger_1.ApiOperation)({ summary: 'Profiles that liked/super-liked me but we have not matched yet' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DiscoveryController.prototype, "getLikesReceived", null);
exports.DiscoveryController = DiscoveryController = __decorate([
    (0, swagger_1.ApiTags)('Discovery'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(onboarding_guard_1.OnboardingGuard),
    (0, common_1.Controller)('discovery'),
    __metadata("design:paramtypes", [discovery_service_1.DiscoveryService])
], DiscoveryController);
//# sourceMappingURL=discovery.controller.js.map