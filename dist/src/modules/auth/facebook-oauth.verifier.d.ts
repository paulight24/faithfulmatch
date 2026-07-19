import { ConfigService } from '@nestjs/config';
import { OAuthProviderVerifier, OAuthVerifyResult } from '../../infrastructure/oauth/oauth-provider-verifier.interface';
export declare class FacebookOAuthVerifier implements OAuthProviderVerifier {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    isConfigured(): boolean;
    verifyToken(accessToken: string): Promise<OAuthVerifyResult>;
    private assertTokenBelongsToApp;
}
