export interface AiCompletionResult {
    content: string;
    tokensUsed: number | null;
}
export interface AiChatClient {
    isEnabled(): boolean;
    completeText(systemPrompt: string, userPrompt: string, jsonMode?: boolean): Promise<AiCompletionResult>;
    completeVision(systemPrompt: string, userPrompt: string, imageDataUri: string): Promise<AiCompletionResult>;
}
export declare const AI_CHAT_CLIENT: unique symbol;
