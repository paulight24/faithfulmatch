import { ConfigService } from '@nestjs/config';
import * as Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from '../../infrastructure/payments/stripe.service';
export declare class SubscriptionsService {
    private readonly prisma;
    private readonly stripe;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, stripe: StripeService, config: ConfigService);
    getMine(userId: string): Promise<{
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        currentPeriodEnd: Date;
        billingAvailable: boolean;
        canManageBilling: boolean;
    }>;
    createBillingPortalSession(userId: string): Promise<{
        url: string;
    }>;
    registerInterest(userId: string): Promise<{
        message: string;
    }>;
    createCheckoutSession(userId: string): Promise<{
        url: string;
    }>;
    confirmCheckoutSession(userId: string, sessionId: string): Promise<{
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        currentPeriodEnd: Date;
        billingAvailable: boolean;
        canManageBilling: boolean;
    }>;
    handleWebhookEvent(event: Stripe.Event): Promise<void>;
    private upsertFromStripeSubscription;
}
