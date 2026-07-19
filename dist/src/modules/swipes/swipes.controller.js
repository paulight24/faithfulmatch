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
exports.SwipesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swipes_service_1 = require("./swipes.service");
const record_swipe_dto_1 = require("./dto/record-swipe.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const onboarding_guard_1 = require("../../common/guards/onboarding.guard");
let SwipesController = class SwipesController {
    constructor(swipes) {
        this.swipes = swipes;
    }
    recordSwipe(user, dto) {
        return this.swipes.recordSwipe(user.id, dto);
    }
    getMySwipes(user) {
        return this.swipes.getMySwipes(user.id);
    }
};
exports.SwipesController = SwipesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Record a LIKE, PASS, or SUPER_LIKE on a profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, record_swipe_dto_1.RecordSwipeDto]),
    __metadata("design:returntype", void 0)
], SwipesController.prototype, "recordSwipe", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, swagger_1.ApiOperation)({ summary: 'Get your swipe history' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SwipesController.prototype, "getMySwipes", null);
exports.SwipesController = SwipesController = __decorate([
    (0, swagger_1.ApiTags)('Swipes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(onboarding_guard_1.OnboardingGuard),
    (0, common_1.Controller)('swipes'),
    __metadata("design:paramtypes", [swipes_service_1.SwipesService])
], SwipesController);
//# sourceMappingURL=swipes.controller.js.map