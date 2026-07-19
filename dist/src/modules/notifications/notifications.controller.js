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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const notifications_service_1 = require("./notifications.service");
const register_device_token_dto_1 = require("./dto/register-device-token.dto");
let NotificationsController = class NotificationsController {
    constructor(notifications, config) {
        this.notifications = notifications;
        this.config = config;
    }
    getPushPublicKey() {
        return { publicKey: this.config.get('vapid.publicKey') ?? null };
    }
    list(user, cursor) {
        return this.notifications.list(user.id, cursor);
    }
    unreadCount(user) {
        return this.notifications.unreadCount(user.id);
    }
    markRead(user, id) {
        return this.notifications.markRead(user.id, id);
    }
    markAllRead(user) {
        return this.notifications.markAllRead(user.id);
    }
    registerDeviceToken(user, dto) {
        return this.notifications.registerDeviceToken(user.id, dto);
    }
    removeDeviceToken(user, token) {
        return this.notifications.removeDeviceToken(user.id, token);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('push/public-key'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getPushPublicKey", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "unreadCount", null);
__decorate([
    (0, common_1.Post)(':id/read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markRead", null);
__decorate([
    (0, common_1.Post)('read-all'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllRead", null);
__decorate([
    (0, common_1.Post)('device-tokens'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, register_device_token_dto_1.RegisterDeviceTokenDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "registerDeviceToken", null);
__decorate([
    (0, common_1.Delete)('device-tokens/:token'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "removeDeviceToken", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        config_1.ConfigService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map