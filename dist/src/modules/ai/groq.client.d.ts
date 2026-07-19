import { ConfigService } from '@nestjs/config';
import { AiChatClient, AiCompletionResult } from './ai-client.interface';
export declare class GroqClient implements AiChatClient {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    isEnabled(): boolean;
    private assertEnabled;
    completeText(systemPrompt: string, userPrompt: string, jsonMode?: boolean): Promise<AiCompletionResult>;
    completeVision(systemPrompt: string, userPrompt: string, imageUrl: string): Promise<AiCompletionResult>;
    private request;
}
