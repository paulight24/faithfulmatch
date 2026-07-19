import { ConfigService } from '@nestjs/config';
import { PushProvider, SendPushParams } from './push-provider.interface';
export declare class PushSubscriptionGoneError extends Error {
}
export declare class WebPushProvider implements PushProvider {
    private readonly config;
    private readonly logger;
    private readonly enabled;
    constructor(config: ConfigService);
    isEnabled(): boolean;
    sendPush(params: SendPushParams): Promise<void>;
}
