"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const index_1 = require("./index");
const swaggerServerUrl = process.env.SWAGGER_SERVER_URL ??
    process.env.PUBLIC_BASE_URL ??
    process.env.RENDER_EXTERNAL_URL ??
    "";
const servers = [
    {
        url: `http://localhost:${index_1.config.port}`,
        description: "Development server",
    },
];
if (swaggerServerUrl && !servers.some((server) => server.url === swaggerServerUrl)) {
    servers.unshift({
        url: swaggerServerUrl,
        description: "Production server",
    });
}
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Agent Portal API",
            version: "1.0.0",
            description: "Scalable Agent Portal Backend API Documentation",
        },
        servers,
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        data: { type: "object" },
                        message: { type: "string" },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        error: {
                            type: "object",
                            properties: {
                                code: { type: "string", example: "VALIDATION_ERROR" },
                                message: { type: "string", example: "Invalid input data" },
                            },
                        },
                    },
                },
                PaginationMeta: {
                    type: "object",
                    properties: {
                        total: { type: "number", example: 100 },
                        page: { type: "number", example: 1 },
                        limit: { type: "number", example: 10 },
                        totalPages: { type: "number", example: 10 },
                    },
                },
                PaginatedResponse: {
                    type: "object",
                    properties: {
                        data: { type: "array", items: { type: "object" } },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", format: "email", example: "john@example.com" },
                        role: { type: "string", enum: ["ADMIN", "AGENT", "MANAGER"], example: "AGENT" },
                        isActive: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Booking: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        customerName: { type: "string", example: "Jane Smith" },
                        serviceTitle: { type: "string", example: "Kenya Safari Package" },
                        amount: { type: "number", example: 1500.00 },
                        currency: { type: "string", enum: ["USD", "KES"], example: "USD" },
                        commissionRate: { type: "number", example: 0.25 },
                        commissionAmount: { type: "number", example: 48750.00 },
                        commissionCurrency: { type: "string", enum: ["USD", "KES"], example: "KES" },
                        status: { type: "string", enum: ["DRAFT", "CONFIRMED", "CANCELLED"], example: "DRAFT" },
                        paymentStatus: { type: "string", enum: ["UNPAID", "PAID"], example: "UNPAID" },
                        agentId: { type: "string", format: "uuid" },
                        serviceStartAt: { type: "string", format: "date-time" },
                        serviceEndAt: { type: "string", format: "date-time" },
                        serviceTimezone: { type: "string", example: "Africa/Nairobi" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Payment: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        bookingId: { type: "string", format: "uuid" },
                        provider: { type: "string", enum: ["MPESA", "STRIPE", "PAYPAL", "VISA", "MASTERCARD"], example: "STRIPE" },
                        amount: { type: "number", example: 1500.00 },
                        currency: { type: "string", enum: ["USD", "KES"], example: "USD" },
                        state: { type: "string", enum: ["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"], example: "PENDING" },
                        reference: { type: "string", example: "PAY_12345" },
                        metadata: { type: "object" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Partner: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Safari Tours Co" },
                        email: { type: "string", format: "email", example: "contact@safaritours.com" },
                        phone: { type: "string", example: "+254712345678" },
                        isActive: { type: "boolean", example: true },
                        approvalStatus: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"], example: "PENDING" },
                        createdById: { type: "string", format: "uuid" },
                        approvedById: { type: "string", format: "uuid" },
                        approvedAt: { type: "string", format: "date-time" },
                        rejectedReason: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                InventoryItem: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        partnerId: { type: "string", format: "uuid" },
                        title: { type: "string", example: "3-Day Safari Package" },
                        description: { type: "string", example: "Amazing wildlife experience" },
                        price: { type: "number", example: 500.00 },
                        status: { type: "string", enum: ["DRAFT", "ACTIVE", "INACTIVE"], example: "ACTIVE" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Quote: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        bookingId: { type: "string", format: "uuid" },
                        agentId: { type: "string", format: "uuid" },
                        title: { type: "string", example: "Safari Package Quote" },
                        status: { type: "string", enum: ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"], example: "DRAFT" },
                        amount: { type: "number", example: 1500.00 },
                        currency: { type: "string", enum: ["USD", "KES"], example: "USD" },
                        commissionRate: { type: "number", example: 0.25 },
                        commissionAmount: { type: "number", example: 48750.00 },
                        commissionCurrency: { type: "string", enum: ["USD", "KES"], example: "KES" },
                        expiresAt: { type: "string", format: "date-time" },
                        items: { type: "object" },
                        notes: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Contract: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        bookingId: { type: "string", format: "uuid" },
                        partnerId: { type: "string", format: "uuid" },
                        status: { type: "string", enum: ["DRAFT", "SENT", "SIGNED", "CANCELLED"], example: "DRAFT" },
                        fileUrl: { type: "string" },
                        signedAt: { type: "string", format: "date-time" },
                        metadata: { type: "object" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Receipt: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        bookingId: { type: "string", format: "uuid" },
                        paymentId: { type: "string", format: "uuid" },
                        receiptNumber: { type: "string", example: "RCPT-2026-0001" },
                        status: { type: "string", enum: ["ISSUED", "VOID"], example: "ISSUED" },
                        amount: { type: "number", example: 1500.00 },
                        currency: { type: "string", enum: ["USD", "KES"], example: "USD" },
                        issuedAt: { type: "string", format: "date-time" },
                        fileUrl: { type: "string" },
                    },
                },
                Dispute: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        bookingId: { type: "string", format: "uuid" },
                        status: { type: "string", enum: ["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"], example: "OPEN" },
                        reason: { type: "string", example: "Service not delivered" },
                        description: { type: "string" },
                        openedById: { type: "string", format: "uuid" },
                        assignedToId: { type: "string", format: "uuid" },
                        resolvedAt: { type: "string", format: "date-time" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Refund: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        bookingId: { type: "string", format: "uuid" },
                        paymentId: { type: "string", format: "uuid" },
                        amount: { type: "number", example: 200.00 },
                        currency: { type: "string", enum: ["USD", "KES"], example: "USD" },
                        status: { type: "string", enum: ["REQUESTED", "APPROVED", "DECLINED", "PROCESSING", "COMPLETED", "FAILED"], example: "REQUESTED" },
                        reason: { type: "string", example: "Customer cancellation" },
                        reference: { type: "string" },
                        processedAt: { type: "string", format: "date-time" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                PartnerEvent: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        partnerId: { type: "string", format: "uuid" },
                        type: { type: "string", enum: ["APPROVED", "REJECTED"], example: "APPROVED" },
                        actorId: { type: "string", format: "uuid" },
                        metadata: { type: "object" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Dispatch: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        bookingId: { type: "string", format: "uuid" },
                        assignedToId: { type: "string", format: "uuid" },
                        status: { type: "string", enum: ["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"], example: "PENDING" },
                        notes: { type: "string" },
                        startedAt: { type: "string", format: "date-time" },
                        completedAt: { type: "string", format: "date-time" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                DispatchTrackPoint: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        dispatchId: { type: "string", format: "uuid" },
                        latitude: { type: "number", example: -1.286389 },
                        longitude: { type: "number", example: 36.817223 },
                        recordedAt: { type: "string", format: "date-time" },
                        metadata: { type: "object" },
                    },
                },
                DispatchEvent: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        dispatchId: { type: "string", format: "uuid" },
                        type: { type: "string", enum: ["CREATED", "ASSIGNED", "STATUS_CHANGED"], example: "CREATED" },
                        actorId: { type: "string", format: "uuid" },
                        metadata: { type: "object" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
        tags: [
            { name: "Auth", description: "Authentication endpoints" },
            { name: "Bookings", description: "Booking management" },
            { name: "Payments", description: "Payment processing" },
            { name: "Partners", description: "Partner management" },
            { name: "Inventory", description: "Inventory management" },
            { name: "Quotes", description: "Quote management" },
            { name: "Contracts", description: "Contract management" },
            { name: "Receipts", description: "Receipt management" },
            { name: "Disputes", description: "Dispute management" },
            { name: "Refunds", description: "Refund management" },
            { name: "Integrations", description: "External integration stubs" },
            { name: "Dispatch", description: "Dispatch and live tracking" },
        ],
    },
    apis: ["./src/modules/**/*.routes.ts", "./src/docs/**/*.yaml"],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map