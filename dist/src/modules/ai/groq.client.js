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
var GroqClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqClient = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';
let GroqClient = GroqClient_1 = class GroqClient {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(GroqClient_1.name);
    }
    isEnabled() {
        return this.config.get('providers.ai') === 'groq' && !!this.config.get('groq.apiKey');
    }
    assertEnabled() {
        if (!this.isEnabled()) {
            throw new common_1.ServiceUnavailableException('AI features are currently disabled.');
        }
    }
    async completeText(systemPrompt, userPrompt, jsonMode = true) {
        this.assertEnabled();
        const body = {
            model: this.config.get('groq.textModel'),
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1024,
        };
        if (jsonMode) {
            body['response_format'] = { type: 'json_object' };
        }
        return this.request(body);
    }
    async completeVision(systemPrompt, userPrompt, imageUrl) {
        this.assertEnabled();
        const body = {
            model: this.config.get('groq.visionModel'),
            messages: [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: userPrompt },
                        { type: 'image_url', image_url: { url: imageUrl } },
                    ],
                },
            ],
            temperature: 0.5,
            max_tokens: 512,
            response_format: { type: 'json_object' },
        };
        return this.request(body);
    }
    async request(body) {
        const apiKey = this.config.get('groq.apiKey');
        const res = await fetch(GROQ_CHAT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            this.logger.error(`Groq API error ${res.status}: ${text}`);
            throw new common_1.ServiceUnavailableException('AI provider request failed.');
        }
        const json = await res.json();
        const content = json?.choices?.[0]?.message?.content;
        if (!content) {
            throw new common_1.ServiceUnavailableException('AI provider returned an empty response.');
        }
        return {
            content,
            tokensUsed: json?.usage?.total_tokens ?? null,
        };
    }
};
exports.GroqClient = GroqClient;
exports.GroqClient = GroqClient = GroqClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GroqClient);
//# sourceMappingURL=groq.client.js.map