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
exports.ProfilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const profiles_service_1 = require("./profiles.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
let ProfilesController = class ProfilesController {
    constructor(profiles) {
        this.profiles = profiles;
    }
    getMyProfile(user) {
        return this.profiles.getOrCreateProfile(user.id);
    }
    updateMyProfile(user, dto) {
        return this.profiles.updateProfile(user.id, dto);
    }
    uploadPhoto(user, file) {
        return this.profiles.uploadPhoto(user.id, file);
    }
    deletePhoto(user, photoId) {
        return this.profiles.deletePhoto(user.id, photoId);
    }
    setPrimary(user, photoId) {
        return this.profiles.setPrimaryPhoto(user.id, photoId);
    }
    updateVisibility(user, body) {
        return this.profiles.setVisibility(user.id, body.visible);
    }
    getBoostStatus(user) {
        return this.profiles.getBoostStatus(user.id);
    }
    activateBoost(user) {
        return this.profiles.activateBoost(user.id);
    }
};
exports.ProfilesController = ProfilesController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile, photos, and completion score' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Update profile fields and recalculate completion score' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Post)('photos'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a profile photo (starts as PENDING moderation)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
            new common_1.FileTypeValidator({ fileType: /image\/(jpeg|png|webp)/ }),
        ],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Delete)('photos/:photoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a profile photo' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "deletePhoto", null);
__decorate([
    (0, common_1.Put)('photos/:photoId/primary'),
    (0, swagger_1.ApiOperation)({ summary: 'Set an approved photo as the primary profile photo' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "setPrimary", null);
__decorate([
    (0, common_1.Patch)('me/visibility'),
    (0, swagger_1.ApiOperation)({ summary: 'Pause (hide) or resume (show) your profile in discovery' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "updateVisibility", null);
__decorate([
    (0, common_1.Get)('me/boost'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current profile boost status' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "getBoostStatus", null);
__decorate([
    (0, common_1.Post)('me/boost'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a 30-minute profile boost (Premium, once every 7 days)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "activateBoost", null);
exports.ProfilesController = ProfilesController = __decorate([
    (0, swagger_1.ApiTags)('Profiles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('profiles'),
    __metadata("design:paramtypes", [profiles_service_1.ProfilesService])
], ProfilesController);
//# sourceMappingURL=profiles.controller.js.map