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
var NodemailerEmailProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerEmailProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let NodemailerEmailProvider = NodemailerEmailProvider_1 = class NodemailerEmailProvider {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(NodemailerEmailProvider_1.name);
        this.transporter = null;
    }
    getTransporter() {
        if (this.transporter)
            return this.transporter;
        const emailProvider = this.config.get('email.provider');
        if (emailProvider === 'console') {
            this.transporter = nodemailer.createTransport({ jsonTransport: true });
            return this.transporter;
        }
        this.transporter = nodemailer.createTransport({
            host: this.config.get('email.smtpHost'),
            port: this.config.get('email.smtpPort'),
            secure: this.config.get('email.smtpSecure'),
            auth: {
                user: this.config.get('email.smtpUser'),
                pass: this.config.get('email.smtpPass'),
            },
        });
        return this.transporter;
    }
    async sendEmail(params) {
        const { to, subject, html, text } = params;
        const from = this.config.get('email.from');
        const emailProvider = this.config.get('email.provider');
        if (emailProvider === 'console') {
            this.logger.log(`[EMAIL CONSOLE] To: ${to} | Subject: ${subject}\n${text ?? html}`);
            return;
        }
        try {
            await this.getTransporter().sendMail({ from, to, subject, html, text });
            this.logger.log(`Email sent to ${to}: ${subject}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}: ${subject}`, error);
            throw error;
        }
    }
};
exports.NodemailerEmailProvider = NodemailerEmailProvider;
exports.NodemailerEmailProvider = NodemailerEmailProvider = NodemailerEmailProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NodemailerEmailProvider);
//# sourceMappingURL=nodemailer-email.provider.js.map