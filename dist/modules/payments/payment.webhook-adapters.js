"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeWebhookPayload = void 0;
const ApiError_1 = require("../../utils/ApiError");
const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const asRecord = (value) => isRecord(value) ? value : undefined;
const asString = (value) => typeof value === "string" && value.length > 0 ? value : undefined;
const asNumber = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
};
const normalizeCurrency = (value) => {
    const upper = asString(value)?.toUpperCase();
    if (upper === "USD" || upper === "KES") {
        return upper;
    }
    return undefined;
};
const ensureReferenceAndStatus = (reference, status, provider) => {
    if (!reference || !status) {
        throw ApiError_1.ApiError.badRequest(`Webhook payload missing ${!reference ? "reference" : "status"}`, `${provider ?? "PAYMENT"}_WEBHOOK_INVALID`);
    }
};
const fallbackAdapter = ({ provider, payload }) => {
    const record = isRecord(payload) ? payload : {};
    const reference = asString(record["reference"]) ?? asString(record["id"]);
    const status = asString(record["status"]) ?? asString(record["state"]);
    ensureReferenceAndStatus(reference, status, provider);
    return {
        reference: reference,
        status: status,
        amount: asNumber(record["amount"]),
        currency: normalizeCurrency(record["currency"]),
        eventType: asString(record["eventType"]),
        metadata: isRecord(record["metadata"]) ? record["metadata"] : undefined,
        eventId: asString(record["eventId"]) ?? asString(record["id"]),
        reason: asString(record["reason"]),
    };
};
const stripeAdapter = ({ payload }) => {
    const record = asRecord(payload) ?? {};
    const data = asRecord(record["data"]) ?? {};
    const objRecord = asRecord(data["object"]) ?? {};
    const metadata = asRecord(objRecord["metadata"]);
    const chargesRecord = asRecord(objRecord["charges"]);
    const chargesData = Array.isArray(chargesRecord?.["data"])
        ? chargesRecord?.["data"]
        : undefined;
    const firstCharge = chargesData && chargesData[0] && isRecord(chargesData[0])
        ? chargesData[0]
        : undefined;
    const reference = asString(metadata?.["reference"]) ??
        asString(objRecord["id"]) ??
        asString(firstCharge?.["payment_intent"]) ??
        asString(record["id"]);
    const status = asString(objRecord["status"]) ??
        asString(objRecord["payment_status"]) ??
        asString(firstCharge?.["status"]);
    ensureReferenceAndStatus(reference, status, "STRIPE");
    const amountInMinorUnits = asNumber(objRecord["amount_received"]) ??
        asNumber(objRecord["amount_captured"]) ??
        asNumber(objRecord["amount"]);
    const amount = typeof amountInMinorUnits === "number"
        ? amountInMinorUnits >= 1000 ? amountInMinorUnits / 100 : amountInMinorUnits
        : undefined;
    const currency = normalizeCurrency(objRecord["currency"]);
    return {
        reference: reference,
        status: status,
        amount,
        currency,
        eventType: asString(record["type"]),
        metadata: {
            stripeObject: objRecord,
            eventType: asString(record["type"]),
        },
        eventId: asString(record["id"]),
    };
};
const mpesaAdapter = ({ payload }) => {
    const payloadRecord = asRecord(payload) ?? {};
    const body = asRecord(payloadRecord["Body"]) ?? {};
    const callback = asRecord(body["stkCallback"]) ??
        asRecord(payloadRecord["Result"]) ??
        {};
    const reference = asString(callback["CheckoutRequestID"]) ??
        asString(callback["MerchantRequestID"]) ??
        asString(callback["ConversationID"]);
    const resultCode = asNumber(callback["ResultCode"]);
    const status = resultCode === 0 ? "COMPLETED" : "FAILED";
    ensureReferenceAndStatus(reference, status, "MPESA");
    const callbackMetadata = asRecord(callback["CallbackMetadata"]) ?? {};
    const metadataItems = Array.isArray(callbackMetadata["Item"])
        ? callbackMetadata["Item"].filter(isRecord)
        : [];
    const lookupItemValue = (name) => {
        const match = metadataItems.find((item) => item["Name"] === name);
        return match ? match["Value"] : undefined;
    };
    const amount = asNumber(lookupItemValue("Amount"));
    const phoneNumber = asString(lookupItemValue("PhoneNumber"));
    return {
        reference: reference,
        status,
        amount,
        currency: "KES",
        eventType: "STK_CALLBACK",
        metadata: {
            merchantRequestId: asString(callback["MerchantRequestID"]),
            checkoutRequestId: asString(callback["CheckoutRequestID"]),
            resultDesc: asString(callback["ResultDesc"]),
            metadataItems,
            phoneNumber,
        },
        eventId: asString(callback["CheckoutRequestID"]) ??
            asString(callback["MerchantRequestID"]),
        reason: resultCode === 0 ? undefined : asString(callback["ResultDesc"]),
    };
};
const paypalAdapter = ({ payload }) => {
    const record = asRecord(payload) ?? {};
    const resource = asRecord(record["resource"]) ?? {};
    const reference = asString(resource["invoice_id"]) ??
        asString(resource["id"]) ??
        asString(record["id"]);
    const status = asString(resource["status"]) ?? asString(record["event_type"]);
    ensureReferenceAndStatus(reference, status, "PAYPAL");
    const amountValue = asRecord(resource["amount"]) ??
        (Array.isArray(resource["purchase_units"]) &&
            resource["purchase_units"].length > 0 &&
            isRecord(resource["purchase_units"][0])
            ? asRecord(resource["purchase_units"][0]["amount"])
            : undefined);
    const amount = amountValue ? asNumber(amountValue["value"] ?? amountValue["total"]) : undefined;
    const currency = amountValue ? normalizeCurrency(amountValue["currency"] ?? amountValue["currency_code"]) : undefined;
    return {
        reference: reference,
        status: status,
        amount,
        currency,
        eventType: asString(record["event_type"]),
        metadata: {
            resource,
            summary: asString(record["summary"]),
        },
        eventId: asString(record["id"]),
        reason: asString(resource["reason_code"] ?? resource["reason"]),
    };
};
const adapters = {
    STRIPE: stripeAdapter,
    MPESA: mpesaAdapter,
    PAYPAL: paypalAdapter,
};
const normalizeWebhookPayload = (input) => {
    const adapter = adapters[input.provider] ?? fallbackAdapter;
    return adapter(input);
};
exports.normalizeWebhookPayload = normalizeWebhookPayload;
//# sourceMappingURL=payment.webhook-adapters.js.map