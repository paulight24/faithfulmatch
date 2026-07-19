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
var WebPushProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPushProvider = exports.PushSubscriptionGoneError = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const webpush = require("web-push");
class PushSubscriptionGoneError extends Error {
}
exports.PushSubscriptionGoneError = PushSubscriptionGoneError;
let WebPushProvider = WebPushProvider_1 = class WebPushProvider {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(WebPushProvider_1.name);
        const publicKey = this.config.get('vapid.publicKey');
        const privateKey = this.config.get('vapid.privateKey');
        const subject = this.config.get('vapid.subject');
        this.enabled = !!publicKey && !!privateKey;
        if (this.enabled) {
            webpush.setVapidDetails(subject, publicKey, privateKey);
        }
        else {
            this.logger.warn('VAPID keys not configured — web push is disabled.');
        }
    }
    isEnabled() {
        return this.enabled;
    }
    async sendPush(params) {
        if (!this.enabled)
            return;
        let subscription;
        try {
            subscription = JSON.parse(params.deviceToken);
        }
        catch {
            this.logger.warn('Stored push subscription is not valid JSON — skipping.');
            return;
        }
        const payload = JSON.stringify({
            title: params.title,
            body: params.body,
            data: params.data ?? {},
        });
        try {
            await webpush.sendNotification(subscription, payload);
        }
        catch (err) {
            const statusCode = err?.statusCode;
            if (statusCode === 404 || statusCode === 410) {
                throw new PushSubscriptionGoneError('Subscription is no longer valid.');
            }
            this.logger.warn(`Push send failed: ${err.message}`);
        }
    }
};
exports.WebPushProvider = WebPushProvider;
exports.WebPushProvider = WebPushProvider = WebPushProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WebPushProvider);
//# sourceMappingURL=webpush.provider.js.map