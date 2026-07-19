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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_service_1 = require("./messages.service");
const send_message_dto_1 = require("./dto/send-message.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let MessagesController = class MessagesController {
    constructor(messages) {
        this.messages = messages;
    }
    send(user, conversationId, dto) {
        return this.messages.sendMessage(user.id, conversationId, dto);
    }
    list(user, conversationId, cursor) {
        return this.messages.getMessages(user.id, conversationId, cursor);
    }
    markRead(user, conversationId) {
        return this.messages.markRead(user.id, conversationId);
    }
    delete(user, messageId) {
        return this.messages.deleteMessage(user.id, messageId);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message in a conversation' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "send", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages for a conversation (newest first, cursor-paginated)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all unread messages as read' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "markRead", null);
__decorate([
    (0, common_1.Delete)(':messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete a message (own messages only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "delete", null);
exports.MessagesController = MessagesController = __decorate([
    (0, swagger_1.ApiTags)('Messages'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('conversations/:conversationId/messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map