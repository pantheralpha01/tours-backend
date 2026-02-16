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
    respondApiKey: process.env.RESPOND_API_KEY ?? "",
    respondApiBaseUrl: process.env.RESPOND_API_BASE_URL ?? "",
    airtableApiKey: process.env.AIRTABLE_API_KEY ?? "",
    airtableBaseId: process.env.AIRTABLE_BASE_ID ?? "",
    airtableTable: process.env.AIRTABLE_TABLE ?? "",
    paypalClientId: process.env.PAYPAL_CLIENT_ID ?? "",
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET ?? "",
    cardGatewayKey: process.env.CARD_GATEWAY_KEY ?? "",
    mpesaConsumerKey: process.env.MPESA_CONSUMER_KEY ?? "",
    mpesaConsumerSecret: process.env.MPESA_CONSUMER_SECRET ?? "",
    mpesaShortCode: process.env.MPESA_SHORT_CODE ?? "",
    mpesaPasskey: process.env.MPESA_PASSKEY ?? "",
    mpesaCallbackUrl: process.env.MPESA_CALLBACK_URL ?? "",
};
//# sourceMappingURL=index.js.map