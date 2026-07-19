export interface AiCompletionParams {
    prompt: string;
    maxTokens?: number;
}
export interface AiProvider {
    complete(params: AiCompletionParams): Promise<string>;
}
export declare const AI_PROVIDER: unique symbol;
