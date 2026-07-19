import { ConfigService } from '@nestjs/config';
import * as Stripe from 'stripe';
export declare class StripeService {
    private readonly config;
    private readonly logger;
    private readonly client;
    constructor(config: ConfigService);
    isEnabled(): boolean;
    private assertEnabled;
    createCheckoutSession(params: {
        userId: string;
        email: string;
        successUrl: string;
        cancelUrl: string;
    }): Promise<string>;
    retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session>;
    findCustomerIdByEmail(email: string): Promise<string | null>;
    createBillingPortalSession(customerId: string, returnUrl: string): Promise<string>;
    constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event;
}
