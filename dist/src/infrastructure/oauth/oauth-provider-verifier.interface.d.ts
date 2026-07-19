export interface OAuthVerifyResult {
    providerAccountId: string;
    email: string | null;
    emailVerified: boolean;
    name?: string;
}
export interface OAuthProviderVerifier {
    verifyToken(token: string): Promise<OAuthVerifyResult>;
}
export declare const OAUTH_PROVIDER_VERIFIER: unique symbol;
