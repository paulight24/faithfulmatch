import { ConfigService } from '@nestjs/config';
import { AiChatClient, AiCompletionResult } from './ai-client.interface';
export declare class GeminiClient implements AiChatClient {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    isEnabled(): boolean;
    private assertEnabled;
    completeText(systemPrompt: string, userPrompt: string, jsonMode?: boolean): Promise<AiCompletionResult>;
    completeVision(systemPrompt: string, userPrompt: string, imageDataUri: string): Promise<AiCompletionResult>;
    private parseDataUri;
    private request;
}
