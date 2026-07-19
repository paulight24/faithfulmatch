declare const _default: () => {
    nodeEnv: string;
    port: number;
    appUrl: string;
    adminUrl: string;
    apiUrl: string;
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpiresIn: string;
        refreshExpiresIn: string;
    };
    storage: {
        provider: string;
        uploadDir: string;
        maxFileSizeMb: number;
    };
    r2: {
        endpoint: string;
        accessKeyId: string;
        secretAccessKey: string;
        bucket: string;
        publicUrl: string;
    };
    email: {
        provider: string;
        smtpHost: string;
        smtpPort: number;
        smtpSecure: boolean;
        smtpUser: string;
        smtpPass: string;
        from: string;
    };
    supportEmail: string;
    vapid: {
        publicKey: string;
        privateKey: string;
        subject: string;
    };
    providers: {
        sms: string;
        push: string;
        payment: string;
        ai: string;
    };
    groq: {
        apiKey: string;
        textModel: string;
        visionModel: string;
    };
    gemini: {
        apiKey: string;
        textModel: string;
        visionModel: string;
    };
    openai: {
        apiKey: string;
        textModel: string;
        visionModel: string;
    };
    facebook: {
        appId: string;
        appSecret: string;
    };
    stripe: {
        publishableKey: string;
        secretKey: string;
        webhookSecret: string;
        premiumPriceId: string;
    };
};
export default _default;
