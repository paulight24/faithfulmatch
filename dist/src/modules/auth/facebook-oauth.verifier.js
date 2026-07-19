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
var FacebookOAuthVerifier_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookOAuthVerifier = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0';
let FacebookOAuthVerifier = FacebookOAuthVerifier_1 = class FacebookOAuthVerifier {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(FacebookOAuthVerifier_1.name);
    }
    isConfigured() {
        return !!this.config.get('facebook.appId') && !!this.config.get('facebook.appSecret');
    }
    async verifyToken(accessToken) {
        if (!this.isConfigured()) {
            throw new common_1.ServiceUnavailableException('Facebook login is not configured.');
        }
        await this.assertTokenBelongsToApp(accessToken);
        const appId = this.config.get('facebook.appId');
        const res = await fetch(`${GRAPH_API_BASE}/me?fields=id,name,email&access_token=${encodeURIComponent(accessToken)}`);
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            this.logger.error(`Facebook /me error ${res.status}: ${text}`);
            throw new common_1.UnauthorizedException('Could not verify your Facebook account.');
        }
        const json = await res.json();
        if (!json?.id) {
            throw new common_1.UnauthorizedException('Could not verify your Facebook account.');
        }
        this.logger.log(`Verified Facebook token for app ${appId}, fb user ${json.id}`);
        return {
            providerAccountId: json.id,
            email: json.email ?? null,
            emailVerified: !!json.email,
            name: json.name,
        };
    }
    async assertTokenBelongsToApp(accessToken) {
        const appId = this.config.get('facebook.appId');
        const appSecret = this.config.get('facebook.appSecret');
        const appAccessToken = `${appId}|${appSecret}`;
        const res = await fetch(`${GRAPH_API_BASE}/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appAccessToken)}`);
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            this.logger.error(`Facebook debug_token error ${res.status}: ${text}`);
            throw new common_1.UnauthorizedException('Could not verify your Facebook account.');
        }
        const json = await res.json();
        const data = json?.data;
        if (!data?.is_valid || String(data?.app_id) !== String(appId)) {
            throw new common_1.UnauthorizedException('This Facebook session is invalid. Please try again.');
        }
    }
};
exports.FacebookOAuthVerifier = FacebookOAuthVerifier;
exports.FacebookOAuthVerifier = FacebookOAuthVerifier = FacebookOAuthVerifier_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FacebookOAuthVerifier);
//# sourceMappingURL=facebook-oauth.verifier.js.map