import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PushProvider, SendPushParams } from './push-provider.interface';
export declare class FcmTokenGoneError extends Error {
}
export declare class FcmProvider implements PushProvider, OnModuleInit {
    private readonly config;
    private readonly logger;
    private enabled;
    constructor(config: ConfigService);
    onModuleInit(): void;
    isEnabled(): boolean;
    sendPush(params: SendPushParams): Promise<void>;
}
