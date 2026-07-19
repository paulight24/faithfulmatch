"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const push_provider_interface_1 = require("./push-provider.interface");
const webpush_provider_1 = require("./webpush.provider");
let PushModule = class PushModule {
};
exports.PushModule = PushModule;
exports.PushModule = PushModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            webpush_provider_1.WebPushProvider,
            { provide: push_provider_interface_1.PUSH_PROVIDER, useExisting: webpush_provider_1.WebPushProvider },
        ],
        exports: [push_provider_interface_1.PUSH_PROVIDER, webpush_provider_1.WebPushProvider],
    })
], PushModule);
//# sourceMappingURL=push.module.js.map