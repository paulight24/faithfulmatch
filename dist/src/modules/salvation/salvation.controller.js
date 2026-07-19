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
exports.SalvationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const salvation_service_1 = require("./salvation.service");
let SalvationController = class SalvationController {
    constructor(salvation) {
        this.salvation = salvation;
    }
    getProgress(user) {
        return this.salvation.getProgress(user.id);
    }
    completeStep(user, stepId) {
        return this.salvation.completeStep(user.id, stepId);
    }
};
exports.SalvationController = SalvationController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalvationController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Post)('me/steps/:stepId/complete'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('stepId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SalvationController.prototype, "completeStep", null);
exports.SalvationController = SalvationController = __decorate([
    (0, swagger_1.ApiTags)('Salvation Journey'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('salvation'),
    __metadata("design:paramtypes", [salvation_service_1.SalvationService])
], SalvationController);
//# sourceMappingURL=salvation.controller.js.map