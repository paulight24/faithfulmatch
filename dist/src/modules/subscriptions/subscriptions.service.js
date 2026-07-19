"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SubscriptionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const stripe_service_1 = require("../../infrastructure/payments/stripe.service");
let SubscriptionsService = SubscriptionsService_1 = class SubscriptionsService {
    constructor(prisma, stripe, config) {
        this.prisma = prisma;
        this.stripe = stripe;
        this.config = config;
        this.logger = new common_1.Logger(SubscriptionsService_1.name);
    }
    async getMine(userId) {
        const sub = await this.prisma.subscription.findUnique({ where: { userId } });
        return {
            plan: sub?.plan ?? 'FREE',
            status: sub?.status ?? 'ACTIVE',
            currentPeriodEnd: sub?.currentPeriodEnd ?? null,
            billingAvailable: this.stripe.isEnabled(),
            canManageBilling: this.stripe.isEnabled() && sub?.plan === client_1.SubscriptionPlan.PREMIUM,
        };
    }
    async createBillingPortalSession(userId) {
        const sub = await this.prisma.subscription.findUnique({ where: { userId } });
        let customerId = sub?.stripeCustomerId ?? null;
        if (!customerId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
            if (user)
                customerId = await this.stripe.findCustomerIdByEmail(user.email);
            if (customerId) {
                await this.prisma.subscription.update({ where: { userId }, data: { stripeCustomerId: customerId } });
            }
        }
        if (!customerId) {
            throw new common_1.BadRequestException('No billing account found for this user yet.');
        }
        const appUrl = this.config.get('appUrl') ?? 'http://localhost:4200';
        const url = await this.stripe.createBillingPortalSession(customerId, `${appUrl}/premium`);
        return { url };
    }
    async registerInterest(userId) {
        await this.prisma.auditLog.create({
            data: { userId, action: 'PREMIUM_INTEREST_REGISTERED' },
        });
        return { message: "Thanks! We'll let you know as soon as Premium is available." };
    }
    async createCheckoutSession(userId) {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            select: { email: true },
        });
        const appUrl = this.config.get('appUrl') ?? 'http://localhost:4200';
        const url = await this.stripe.createCheckoutSession({
            userId,
            email: user.email,
            successUrl: `${appUrl}/premium?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${appUrl}/premium?checkout=cancel`,
        });
        return { url };
    }
    async confirmCheckoutSession(userId, sessionId) {
        const session = await this.stripe.retrieveCheckoutSession(sessionId);
        if (session.client_reference_id !== userId) {
            throw new common_1.BadRequestException('This checkout session does not belong to you.');
        }
        if (session.payment_status !== 'paid') {
            throw new common_1.BadRequestException('Payment has not completed yet.');
        }
        const subscription = session.subscription;
        await this.upsertFromStripeSubscription(userId, subscription);
        return this.getMine(userId);
    }
    async handleWebhookEvent(event) {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = session.client_reference_id ?? session.metadata?.['userId'];
                if (!userId) {
                    this.logger.warn(`checkout.session.completed with no userId (session ${session.id})`);
                    break;
                }
                const subscription = session.subscription;
                if (typeof subscription === 'string') {
                    this.logger.warn('Subscription was not expanded on checkout session; skipping.');
                    break;
                }
                await this.upsertFromStripeSubscription(userId, subscription);
                break;
            }
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const userId = subscription.metadata?.['userId'];
                if (!userId) {
                    this.logger.warn(`${event.type} with no userId in metadata (subscription ${subscription.id})`);
                    break;
                }
                await this.upsertFromStripeSubscription(userId, subscription);
                break;
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const userId = invoice.parent?.subscription_details?.metadata?.['userId'];
                this.logger.warn(`Payment failed for invoice ${invoice.id}`
                    + `${userId ? ` (user ${userId})` : ''} — customer ${invoice.customer}.`);
                if (userId) {
                    await this.prisma.auditLog.create({
                        data: { userId, action: 'SUBSCRIPTION_PAYMENT_FAILED' },
                    });
                }
                break;
            }
            default:
                break;
        }
    }
    async upsertFromStripeSubscription(userId, subscription) {
        const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
        const plan = isActive ? client_1.SubscriptionPlan.PREMIUM : client_1.SubscriptionPlan.FREE;
        const status = isActive ? client_1.SubscriptionStatus.ACTIVE : client_1.SubscriptionStatus.CANCELLED;
        const item = subscription?.items.data[0];
        const currentPeriodEnd = item ? new Date(item.current_period_end * 1000) : null;
        const stripeCustomerId = subscription
            ? (typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id)
            : undefined;
        await this.prisma.subscription.upsert({
            where: { userId },
            create: { userId, plan, status, currentPeriodEnd, stripeCustomerId },
            update: { plan, status, currentPeriodEnd, ...(stripeCustomerId ? { stripeCustomerId } : {}) },
        });
        this.logger.log(`Subscription for user ${userId} set to ${plan}/${status}`);
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = SubscriptionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_service_1.StripeService,
        config_1.ConfigService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map