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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const admin_service_1 = require("./admin.service");
const moderation_dto_1 = require("./dto/moderation.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let AdminController = class AdminController {
    constructor(admin) {
        this.admin = admin;
    }
    stats() {
        return this.admin.getDashboardStats();
    }
    listReports(status, page = 1) {
        return this.admin.listReports(status, page);
    }
    updateReport(user, reportId, dto) {
        return this.admin.updateReport(user.id, reportId, dto);
    }
    applyAction(user, dto) {
        return this.admin.applyModerationAction(user.id, dto);
    }
    listUsers(search, status, page = 1) {
        return this.admin.listUsers(search, status, page);
    }
    pendingPhotos(page = 1) {
        return this.admin.getPendingPhotos(page);
    }
    approvePhoto(user, photoId) {
        return this.admin.approvePhoto(user.id, photoId);
    }
    rejectPhoto(user, photoId, dto) {
        return this.admin.rejectPhoto(user.id, photoId, dto);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform stats (total users, pending reports, etc.)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'List reports, filterable by status' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.ReportStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listReports", null);
__decorate([
    (0, common_1.Put)('reports/:reportId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a report status (REVIEWING / RESOLVED / DISMISSED)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('reportId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, moderation_dto_1.UpdateReportDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateReport", null);
__decorate([
    (0, common_1.Post)('moderation-actions'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply WARN / SUSPEND / BAN / CLEAR to a user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, moderation_dto_1.ModerationActionDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "applyAction", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'List users with optional search and status filter' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.UserStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)('photos/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending photo moderation queue' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "pendingPhotos", null);
__decorate([
    (0, common_1.Put)('photos/:photoId/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a profile photo' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approvePhoto", null);
__decorate([
    (0, common_1.Put)('photos/:photoId/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a profile photo with a reason' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('photoId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, moderation_dto_1.RejectPhotoDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectPhoto", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map