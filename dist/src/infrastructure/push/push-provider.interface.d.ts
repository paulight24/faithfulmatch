export interface SendPushParams {
    deviceToken: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
}
export interface PushProvider {
    sendPush(params: SendPushParams): Promise<void>;
}
export declare const PUSH_PROVIDER: unique symbol;
