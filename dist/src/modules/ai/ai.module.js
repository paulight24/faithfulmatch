"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ai_service_1 = require("./ai.service");
const ai_controller_1 = require("./ai.controller");
const groq_client_1 = require("./groq.client");
const gemini_client_1 = require("./gemini.client");
const openai_client_1 = require("./openai.client");
const ai_client_interface_1 = require("./ai-client.interface");
const storage_module_1 = require("../../infrastructure/storage/storage.module");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [storage_module_1.StorageModule],
        providers: [
            ai_service_1.AiService,
            groq_client_1.GroqClient,
            gemini_client_1.GeminiClient,
            openai_client_1.OpenAiClient,
            {
                provide: ai_client_interface_1.AI_CHAT_CLIENT,
                inject: [config_1.ConfigService, groq_client_1.GroqClient, gemini_client_1.GeminiClient, openai_client_1.OpenAiClient],
                useFactory: (config, groq, gemini, openai) => {
                    switch (config.get('providers.ai')) {
                        case 'gemini':
                            return gemini;
                        case 'openai':
                            return openai;
                        default:
                            return groq;
                    }
                },
            },
        ],
        controllers: [ai_controller_1.AiController],
        exports: [ai_service_1.AiService],
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map