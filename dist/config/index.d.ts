export declare const config: {
    port: number;
    nodeEnv: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    accessTokenSecret: string;
    accessTokenExpiry: number;
    refreshTokenSecret: string;
    refreshTokenExpiry: number;
    allowedOrigins: string;
    twilioAccountSid: string;
    twilioAuthToken: string;
    twilioWhatsappNumber: string;
    twilioSmsNumber: string;
    respondApiKey: string;
    respondApiBaseUrl: string;
    airtableApiKey: string;
    airtableBaseId: string;
    airtableTable: string;
    paypalClientId: string;
    paypalClientSecret: string;
    cardGatewayKey: string;
    stripeSecretKey: string;
    cryptoWalletAddress: string;
    mpesaConsumerKey: string;
    mpesaConsumerSecret: string;
    mpesaShortCode: string;
    mpesaPasskey: string;
    mpesaCallbackUrl: string;
    paymentWebhookSecret: string;
    stripeWebhookSecret: string;
    mpesaWebhookSecret: string;
    paypalWebhookSecret: string;
    partnerInviteBaseUrl: string;
    notificationEmailFrom: string;
    escrowScheduler: {
        enabled: boolean;
        intervalMs: number;
        batchSize: number;
    };
    notificationScheduler: {
        enabled: boolean;
        intervalMs: number;
        batchSize: number;
        maxAttempts: number;
    };
    storage: {
        baseUrl: string;
        tempDir: string;
    };
    offer: {
        publicBaseUrl: string;
    };
    community: {
        publicBaseUrl: string;
        digestScheduler: {
            enabled: boolean;
            intervalMs: number;
            sinceHours: number;
        };
    };
};
//# sourceMappingURL=index.d.ts.map