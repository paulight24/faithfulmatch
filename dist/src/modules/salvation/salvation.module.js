"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalvationModule = void 0;
const common_1 = require("@nestjs/common");
const salvation_service_1 = require("./salvation.service");
const salvation_controller_1 = require("./salvation.controller");
let SalvationModule = class SalvationModule {
};
exports.SalvationModule = SalvationModule;
exports.SalvationModule = SalvationModule = __decorate([
    (0, common_1.Module)({
        providers: [salvation_service_1.SalvationService],
        controllers: [salvation_controller_1.SalvationController],
    })
], SalvationModule);
//# sourceMappingURL=salvation.module.js.map