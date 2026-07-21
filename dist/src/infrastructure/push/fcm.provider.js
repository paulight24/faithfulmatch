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
var FcmProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmProvider = exports.FcmTokenGoneError = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = require("firebase-admin");
class FcmTokenGoneError extends Error {
}
exports.FcmTokenGoneError = FcmTokenGoneError;
let FcmProvider = FcmProvider_1 = class FcmProvider {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(FcmProvider_1.name);
        this.enabled = false;
    }
    onModuleInit() {
        if (admin.apps.length > 0) {
            this.enabled = true;
            return;
        }
        const projectId = this.config.get('FIREBASE_PROJECT_ID');
        const clientEmail = this.config.get('FIREBASE_CLIENT_EMAIL');
        const privateKey = this.config.get('FIREBASE_PRIVATE_KEY');
        if (projectId && clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
            });
            this.enabled = true;
            this.logger.log('Firebase Admin initialized for FCM.');
        }
        else {
            this.logger.warn('Firebase credentials not configured — FCM push is disabled.');
        }
    }
    isEnabled() {
        return this.enabled;
    }
    async sendPush(params) {
        if (!this.enabled)
            return;
        try {
            await admin.messaging().send({
                token: params.deviceToken,
                notification: { title: params.title, body: params.body },
                data: params.data
                    ? Object.fromEntries(Object.entries(params.data).map(([k, v]) => [k, String(v)]))
                    : undefined,
                android: { priority: 'high' },
            });
        }
        catch (err) {
            const code = err?.code;
            if (code === 'messaging/registration-token-not-registered' ||
                code === 'messaging/invalid-registration-token') {
                throw new FcmTokenGoneError('FCM token is no longer valid.');
            }
            this.logger.warn(`FCM send failed: ${err.message}`);
        }
    }
};
exports.FcmProvider = FcmProvider;
exports.FcmProvider = FcmProvider = FcmProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FcmProvider);
//# sourceMappingURL=fcm.provider.js.map