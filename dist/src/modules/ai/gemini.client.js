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
var GeminiClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiClient = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
let GeminiClient = GeminiClient_1 = class GeminiClient {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(GeminiClient_1.name);
    }
    isEnabled() {
        return this.config.get('providers.ai') === 'gemini' && !!this.config.get('gemini.apiKey');
    }
    assertEnabled() {
        if (!this.isEnabled()) {
            throw new common_1.ServiceUnavailableException('AI features are currently disabled.');
        }
    }
    async completeText(systemPrompt, userPrompt, jsonMode = true) {
        this.assertEnabled();
        const model = this.config.get('gemini.textModel');
        const body = {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
                thinkingConfig: { thinkingBudget: 0 },
                ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
            },
        };
        return this.request(model, body);
    }
    async completeVision(systemPrompt, userPrompt, imageDataUri) {
        this.assertEnabled();
        const { mimeType, base64 } = this.parseDataUri(imageDataUri);
        const model = this.config.get('gemini.visionModel');
        const body = {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: userPrompt },
                        { inlineData: { mimeType, data: base64 } },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 4096,
                thinkingConfig: { thinkingBudget: 0 },
                responseMimeType: 'application/json',
            },
        };
        return this.request(model, body);
    }
    parseDataUri(dataUri) {
        const match = dataUri.match(/^data:([^;]+);base64,(.+)$/s);
        if (!match) {
            throw new common_1.ServiceUnavailableException('Invalid image data for AI analysis.');
        }
        return { mimeType: match[1], base64: match[2] };
    }
    async request(model, body) {
        const apiKey = this.config.get('gemini.apiKey');
        const res = await fetch(`${GEMINI_BASE_URL}/${model}:generateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            this.logger.error(`Gemini API error ${res.status}: ${text}`);
            throw new common_1.ServiceUnavailableException('AI provider request failed.');
        }
        const json = await res.json();
        const parts = json?.candidates?.[0]?.content?.parts ?? [];
        const content = parts
            .filter((p) => !p.thought)
            .map((p) => p.text ?? '')
            .join('')
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```\s*$/, '')
            .trim();
        if (!content) {
            this.logger.error(`Gemini returned no usable content: ${JSON.stringify(json).slice(0, 500)}`);
            throw new common_1.ServiceUnavailableException('AI provider returned an empty response.');
        }
        return {
            content,
            tokensUsed: json?.usageMetadata?.totalTokenCount ?? null,
        };
    }
};
exports.GeminiClient = GeminiClient;
exports.GeminiClient = GeminiClient = GeminiClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiClient);
//# sourceMappingURL=gemini.client.js.map