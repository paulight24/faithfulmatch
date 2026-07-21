"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const configuration_1 = require("./config/configuration");
const prisma_module_1 = require("./prisma/prisma.module");
const email_module_1 = require("./infrastructure/email/email.module");
const storage_module_1 = require("./infrastructure/storage/storage.module");
const health_module_1 = require("./modules/health/health.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const profiles_module_1 = require("./modules/profiles/profiles.module");
const preferences_module_1 = require("./modules/preferences/preferences.module");
const discovery_module_1 = require("./modules/discovery/discovery.module");
const swipes_module_1 = require("./modules/swipes/swipes.module");
const matches_module_1 = require("./modules/matches/matches.module");
const messages_module_1 = require("./modules/messages/messages.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const safety_module_1 = require("./modules/safety/safety.module");
const admin_module_1 = require("./modules/admin/admin.module");
const ai_module_1 = require("./modules/ai/ai.module");
const events_module_1 = require("./modules/events/events.module");
const salvation_module_1 = require("./modules/salvation/salvation.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const legal_module_1 = require("./modules/legal/legal.module");
const jwt_auth_guard_1 = require("./modules/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("./modules/auth/guards/roles.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                envFilePath: ['.env'],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'default',
                    ttl: 60_000,
                    limit: 60,
                },
            ]),
            prisma_module_1.PrismaModule,
            email_module_1.EmailModule,
            storage_module_1.StorageModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            profiles_module_1.ProfilesModule,
            preferences_module_1.PreferencesModule,
            discovery_module_1.DiscoveryModule,
            swipes_module_1.SwipesModule,
            matches_module_1.MatchesModule,
            messages_module_1.MessagesModule,
            notifications_module_1.NotificationsModule,
            safety_module_1.SafetyModule,
            admin_module_1.AdminModule,
            ai_module_1.AiModule,
            events_module_1.EventsModule,
            salvation_module_1.SalvationModule,
            subscriptions_module_1.SubscriptionsModule,
            legal_module_1.LegalModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map