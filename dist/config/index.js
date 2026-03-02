"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: Number(process.env.PORT ?? 4000),
    nodeEnv: process.env.NODE_ENV ?? "development",
    jwtSecret: process.env.JWT_SECRET ?? "change-me",
    jwtExpiresIn: "1d",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "access-secret-change-me",
    accessTokenExpiry: 60 * 15, // 15 minutes in seconds
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "refresh-secret-change-me",
    refreshTokenExpiry: 60 * 60 * 24 * 7, // 7 days in seconds
    allowedOrigins: process.env.ALLOWED_ORIGINS ?? "http://localhost:3000",
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? "",
    twilioWhatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER ?? "",
    twilioSmsNumber: process.env.TWILIO_SMS_NUMBER ?? "",
    respondApiKey: process.env.RESPOND_API_KEY ?? "",
    respondApiBaseUrl: process.env.RESPOND_API_BASE_URL ?? "",
    airtableApiKey: process.env.AIRTABLE_API_KEY ?? "",
    airtableBaseId: process.env.AIRTABLE_BASE_ID ?? "",
    airtableTable: process.env.AIRTABLE_TABLE ?? "",
    paypalClientId: process.env.PAYPAL_CLIENT_ID ?? "",
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET ?? "",
    cardGatewayKey: process.env.CARD_GATEWAY_KEY ?? "",
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? "",
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
    cryptoWalletAddress: process.env.CRYPTO_WALLET_ADDRESS ?? "",
    mpesaConsumerKey: process.env.MPESA_CONSUMER_KEY ?? "",
    mpesaConsumerSecret: process.env.MPESA_CONSUMER_SECRET ?? "",
    mpesaShortCode: process.env.MPESA_SHORT_CODE ?? "",
    mpesaPasskey: process.env.MPESA_PASSKEY ?? "",
    mpesaCallbackUrl: process.env.MPESA_CALLBACK_URL ?? "",
    paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET ?? "",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    mpesaWebhookSecret: process.env.MPESA_WEBHOOK_SECRET ?? "",
    paypalWebhookSecret: process.env.PAYPAL_WEBHOOK_SECRET ?? "",
    partnerInviteBaseUrl: process.env.PARTNER_INVITE_BASE_URL ?? "",
    notificationEmailFrom: process.env.NOTIFICATION_EMAIL_FROM ?? "",
    escrowScheduler: {
        enabled: (process.env.ESCROW_SCHEDULER_ENABLED ?? "true") !== "false",
        intervalMs: Number(process.env.ESCROW_SCHEDULER_INTERVAL_MS ?? 60000),
        batchSize: Number(process.env.ESCROW_SCHEDULER_BATCH_SIZE ?? 20),
    },
    notificationScheduler: {
        enabled: (process.env.NOTIFICATION_SCHEDULER_ENABLED ?? "true") !== "false",
        intervalMs: Number(process.env.NOTIFICATION_SCHEDULER_INTERVAL_MS ?? 60000),
        batchSize: Number(process.env.NOTIFICATION_SCHEDULER_BATCH_SIZE ?? 25),
        maxAttempts: Number(process.env.NOTIFICATION_MAX_ATTEMPTS ?? 3),
    },
    storage: {
        baseUrl: process.env.STORAGE_BASE_URL ?? "",
        tempDir: process.env.STORAGE_TEMP_DIR ?? "./tmp",
    },
    offer: {
        publicBaseUrl: process.env.OFFER_PUBLIC_BASE_URL ?? "",
    },
    community: {
        publicBaseUrl: process.env.COMMUNITY_PUBLIC_BASE_URL ?? "",
        digestScheduler: {
            enabled: (process.env.COMMUNITY_DIGEST_SCHEDULER_ENABLED ?? "true") !== "false",
            intervalMs: Number(process.env.COMMUNITY_DIGEST_SCHEDULER_INTERVAL_MS ?? 86400000),
            sinceHours: Number(process.env.COMMUNITY_DIGEST_SINCE_HOURS ?? 24),
        },
    },
};
//# sourceMappingURL=index.js.map