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
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Stripe = require("stripe");
let StripeService = StripeService_1 = class StripeService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(StripeService_1.name);
        const secretKey = this.config.get('stripe.secretKey');
        this.client = secretKey ? new Stripe(secretKey) : null;
    }
    isEnabled() {
        return this.config.get('providers.payment') === 'stripe' && !!this.client;
    }
    assertEnabled() {
        if (!this.client || !this.isEnabled()) {
            throw new common_1.ServiceUnavailableException('Payments are not currently available.');
        }
        return this.client;
    }
    async createCheckoutSession(params) {
        const stripe = this.assertEnabled();
        const priceId = this.config.get('stripe.premiumPriceId');
        if (!priceId) {
            throw new common_1.ServiceUnavailableException('Premium pricing is not configured.');
        }
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            customer_email: params.email,
            client_reference_id: params.userId,
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            metadata: { userId: params.userId },
            subscription_data: { metadata: { userId: params.userId } },
        });
        if (!session.url) {
            throw new common_1.ServiceUnavailableException('Could not start checkout.');
        }
        return session.url;
    }
    async retrieveCheckoutSession(sessionId) {
        const stripe = this.assertEnabled();
        return stripe.checkout.sessions.retrieve(sessionId, { expand: ['subscription'] });
    }
    async findCustomerIdByEmail(email) {
        const stripe = this.assertEnabled();
        const results = await stripe.customers.list({ email, limit: 1 });
        return results.data[0]?.id ?? null;
    }
    async createBillingPortalSession(customerId, returnUrl) {
        const stripe = this.assertEnabled();
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });
        return session.url;
    }
    constructWebhookEvent(rawBody, signature) {
        const stripe = this.assertEnabled();
        const webhookSecret = this.config.get('stripe.webhookSecret');
        if (!webhookSecret) {
            throw new common_1.ServiceUnavailableException('Webhook secret is not configured.');
        }
        try {
            return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        }
        catch (err) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw err;
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map