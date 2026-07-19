"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    appUrl: process.env.APP_URL ?? 'http://localhost:4200',
    adminUrl: process.env.ADMIN_URL ?? 'http://localhost:4300',
    apiUrl: process.env.API_URL ?? 'http://localhost:3000/api/v1',
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET ?? 'INSECURE_DEFAULT_CHANGE_ME',
        refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'INSECURE_DEFAULT_REFRESH_CHANGE_ME',
        accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
        refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d',
    },
    storage: {
        provider: process.env.STORAGE_PROVIDER ?? 'local',
        uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
        maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB ?? '5', 10),
    },
    r2: {
        endpoint: process.env.R2_ENDPOINT,
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        bucket: process.env.R2_BUCKET ?? 'faithfulmatch-photos',
        publicUrl: process.env.R2_PUBLIC_URL,
    },
    email: {
        provider: process.env.EMAIL_PROVIDER ?? 'console',
        smtpHost: process.env.SMTP_HOST,
        smtpPort: parseInt(process.env.SMTP_PORT ?? '465', 10),
        smtpSecure: process.env.SMTP_SECURE === 'true',
        smtpUser: process.env.SMTP_USER,
        smtpPass: process.env.SMTP_PASS,
        from: process.env.EMAIL_FROM ?? 'FaithfulMatch <faithfulmatch@empoweredforwealth.com>',
    },
    supportEmail: process.env.SUPPORT_EMAIL ?? 'faithfulmatch@empoweredforwealth.com',
    vapid: {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY,
        subject: process.env.VAPID_SUBJECT ?? 'mailto:faithfulmatch@empoweredforwealth.com',
    },
    providers: {
        sms: process.env.SMS_PROVIDER ?? 'none',
        push: process.env.PUSH_PROVIDER ?? 'none',
        payment: process.env.PAYMENT_PROVIDER ?? 'none',
        ai: process.env.AI_PROVIDER ?? 'none',
    },
    groq: {
        apiKey: process.env.GROQ_API_KEY,
        textModel: process.env.GROQ_TEXT_MODEL ?? 'llama-3.3-70b-versatile',
        visionModel: process.env.GROQ_VISION_MODEL ?? 'meta-llama/llama-4-scout-17b-16e-instruct',
    },
    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        textModel: process.env.GEMINI_TEXT_MODEL ?? 'gemini-flash-latest',
        visionModel: process.env.GEMINI_VISION_MODEL ?? 'gemini-flash-latest',
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        textModel: process.env.OPENAI_TEXT_MODEL ?? 'gpt-4o-mini',
        visionModel: process.env.OPENAI_VISION_MODEL ?? 'gpt-4o-mini',
    },
    facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
    },
    stripe: {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        premiumPriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    },
});
//# sourceMappingURL=configuration.js.map