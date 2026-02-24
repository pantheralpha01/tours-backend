import { ExternalPaymentProvider } from "../../integrations/payment-gateway";
import { ApiError } from "../../utils/ApiError";

export type NormalizedWebhookPayload = {
  reference: string;
  status: string;
  amount?: number;
  currency?: "USD" | "KES";
  eventType?: string;
  metadata?: Record<string, unknown>;
  eventId?: string;
  reason?: string;
};

type AdapterInput = {
  provider: ExternalPaymentProvider;
  payload: unknown;
};

type AdapterFn = (input: AdapterInput) => NormalizedWebhookPayload;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  isRecord(value) ? value : undefined;

const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.length > 0 ? value : undefined;

const asNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const normalizeCurrency = (value: unknown): "USD" | "KES" | undefined => {
  const upper = asString(value)?.toUpperCase();
  if (upper === "USD" || upper === "KES") {
    return upper;
  }
  return undefined;
};

const ensureReferenceAndStatus = (
  reference?: string,
  status?: string,
  provider?: ExternalPaymentProvider
) => {
  if (!reference || !status) {
    throw ApiError.badRequest(
      `Webhook payload missing ${!reference ? "reference" : "status"}`,
      `${provider ?? "PAYMENT"}_WEBHOOK_INVALID`
    );
  }
};

const fallbackAdapter: AdapterFn = ({ provider, payload }) => {
  const record = isRecord(payload) ? payload : {};
  const reference = asString(record["reference"]) ?? asString(record["id"]);
  const status = asString(record["status"]) ?? asString(record["state"]);
  ensureReferenceAndStatus(reference, status, provider);

  return {
    reference: reference!,
    status: status!,
    amount: asNumber(record["amount"]),
    currency: normalizeCurrency(record["currency"]),
    eventType: asString(record["eventType"]),
    metadata: isRecord(record["metadata"]) ? (record["metadata"] as Record<string, unknown>) : undefined,
    eventId: asString(record["eventId"]) ?? asString(record["id"]),
    reason: asString(record["reason"]),
  };
};

const stripeAdapter: AdapterFn = ({ payload }) => {
  const record = asRecord(payload) ?? {};
  const data = asRecord(record["data"]) ?? {};
  const objRecord = asRecord(data["object"]) ?? {};
  const metadata = asRecord(objRecord["metadata"]);
  const chargesRecord = asRecord(objRecord["charges"]);
  const chargesData = Array.isArray(chargesRecord?.["data"])
    ? (chargesRecord?.["data"] as Array<unknown>)
    : undefined;
  const firstCharge = chargesData && chargesData[0] && isRecord(chargesData[0])
    ? (chargesData[0] as Record<string, unknown>)
    : undefined;

  const reference =
    asString(metadata?.["reference"]) ??
    asString(objRecord["id"]) ??
    asString(firstCharge?.["payment_intent"]) ??
    asString(record["id"]);

  const status =
    asString(objRecord["status"]) ??
    asString(objRecord["payment_status"]) ??
    asString(firstCharge?.["status"]);

  ensureReferenceAndStatus(reference, status, "STRIPE");

  const amountInMinorUnits =
    asNumber(objRecord["amount_received"]) ??
    asNumber(objRecord["amount_captured"]) ??
    asNumber(objRecord["amount"]);

  const amount =
    typeof amountInMinorUnits === "number"
      ? amountInMinorUnits >= 1_000 ? amountInMinorUnits / 100 : amountInMinorUnits
      : undefined;

  const currency = normalizeCurrency(objRecord["currency"]);

  return {
    reference: reference!,
    status: status!,
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

const mpesaAdapter: AdapterFn = ({ payload }) => {
  const payloadRecord = asRecord(payload) ?? {};
  const body = asRecord(payloadRecord["Body"]) ?? {};
  const callback =
    asRecord(body["stkCallback"]) ??
    asRecord(payloadRecord["Result"]) ??
    {};

  const reference =
    asString(callback["CheckoutRequestID"]) ??
    asString(callback["MerchantRequestID"]) ??
    asString(callback["ConversationID"]);

  const resultCode = asNumber(callback["ResultCode"]);
  const status = resultCode === 0 ? "COMPLETED" : "FAILED";

  ensureReferenceAndStatus(reference, status, "MPESA");

  const callbackMetadata = asRecord(callback["CallbackMetadata"]) ?? {};
  const metadataItems = Array.isArray(callbackMetadata["Item"])
    ? (callbackMetadata["Item"] as Array<unknown>).filter(isRecord) as Array<Record<string, unknown>>
    : [];

  const lookupItemValue = (name: string) => {
    const match = metadataItems.find((item) => item["Name"] === name);
    return match ? match["Value"] : undefined;
  };

  const amount = asNumber(lookupItemValue("Amount"));
  const phoneNumber = asString(lookupItemValue("PhoneNumber"));

  return {
    reference: reference!,
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
    eventId:
      asString(callback["CheckoutRequestID"]) ??
      asString(callback["MerchantRequestID"]),
    reason: resultCode === 0 ? undefined : asString(callback["ResultDesc"]),
  };
};

const paypalAdapter: AdapterFn = ({ payload }) => {
  const record = asRecord(payload) ?? {};
  const resource = asRecord(record["resource"]) ?? {};

  const reference =
    asString(resource["invoice_id"]) ??
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
  const currency =
    amountValue ? normalizeCurrency(amountValue["currency"] ?? amountValue["currency_code"]) : undefined;

  return {
    reference: reference!,
    status: status!,
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

const adapters: Partial<Record<ExternalPaymentProvider, AdapterFn>> = {
  STRIPE: stripeAdapter,
  MPESA: mpesaAdapter,
  PAYPAL: paypalAdapter,
};

export const normalizeWebhookPayload = (input: AdapterInput): NormalizedWebhookPayload => {
  const adapter = adapters[input.provider] ?? fallbackAdapter;
  return adapter(input);
};
