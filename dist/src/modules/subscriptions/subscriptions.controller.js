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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const subscriptions_service_1 = require("./subscriptions.service");
const stripe_service_1 = require("../../infrastructure/payments/stripe.service");
const confirm_checkout_dto_1 = require("./dto/confirm-checkout.dto");
let SubscriptionsController = class SubscriptionsController {
    constructor(subscriptions, stripe) {
        this.subscriptions = subscriptions;
        this.stripe = stripe;
    }
    getMine(user) {
        return this.subscriptions.getMine(user.id);
    }
    registerInterest(user) {
        return this.subscriptions.registerInterest(user.id);
    }
    createCheckout(user) {
        return this.subscriptions.createCheckoutSession(user.id);
    }
    confirmCheckout(user, dto) {
        return this.subscriptions.confirmCheckoutSession(user.id, dto.sessionId);
    }
    createBillingPortal(user) {
        return this.subscriptions.createBillingPortalSession(user.id);
    }
    async webhook(req) {
        const signature = req.headers['stripe-signature'];
        if (!signature || typeof signature !== 'string' || !req.rawBody) {
            throw new common_1.BadRequestException('Missing Stripe signature.');
        }
        const event = this.stripe.constructWebhookEvent(req.rawBody, signature);
        await this.subscriptions.handleWebhookEvent(event);
        return { received: true };
    }
};
exports.SubscriptionsController = SubscriptionsController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "getMine", null);
__decorate([
    (0, common_1.Post)('me/interest'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "registerInterest", null);
__decorate([
    (0, common_1.Post)('me/checkout'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a Stripe Checkout session for Premium' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Post)('me/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm a completed checkout immediately (dev fallback for the webhook)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, confirm_checkout_dto_1.ConfirmCheckoutDto]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "confirmCheckout", null);
__decorate([
    (0, common_1.Post)('me/billing-portal'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a Stripe Billing Portal session (manage/cancel subscription)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "createBillingPortal", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Stripe webhook — signature-verified, called by Stripe only' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "webhook", null);
exports.SubscriptionsController = SubscriptionsController = __decorate([
    (0, swagger_1.ApiTags)('Subscriptions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService,
        stripe_service_1.StripeService])
], SubscriptionsController);
//# sourceMappingURL=subscriptions.controller.js.map