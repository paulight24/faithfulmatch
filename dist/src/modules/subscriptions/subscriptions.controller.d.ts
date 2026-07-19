import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { SubscriptionsService } from './subscriptions.service';
import { StripeService } from '../../infrastructure/payments/stripe.service';
import { ConfirmCheckoutDto } from './dto/confirm-checkout.dto';
export declare class SubscriptionsController {
    private readonly subscriptions;
    private readonly stripe;
    constructor(subscriptions: SubscriptionsService, stripe: StripeService);
    getMine(user: {
        id: string;
    }): Promise<{
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        currentPeriodEnd: Date;
        billingAvailable: boolean;
        canManageBilling: boolean;
    }>;
    registerInterest(user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
    createCheckout(user: {
        id: string;
    }): Promise<{
        url: string;
    }>;
    confirmCheckout(user: {
        id: string;
    }, dto: ConfirmCheckoutDto): Promise<{
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        currentPeriodEnd: Date;
        billingAvailable: boolean;
        canManageBilling: boolean;
    }>;
    createBillingPortal(user: {
        id: string;
    }): Promise<{
        url: string;
    }>;
    webhook(req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
