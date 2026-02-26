"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const notification_repository_1 = require("./notification.repository");
const pagination_1 = require("../../utils/pagination");
const email_1 = require("../../integrations/email");
const twilio_1 = require("../../integrations/twilio");
const config_1 = require("../../config");
const ApiError_1 = require("../../utils/ApiError");
const TOKEN_REGEX = /\{\{\s*(\w+)\s*\}\}/g;
const DEFAULT_RETRY_BASE_MS = 60000;
const renderContent = (template, tokens) => {
    if (!template) {
        return "";
    }
    if (!tokens) {
        return template;
    }
    return template.replace(TOKEN_REGEX, (_match, key) => {
        const value = tokens[key];
        return value === undefined || value === null ? "" : String(value);
    });
};
const ensureRecipientForChannel = (channel, job) => {
    if (channel === "EMAIL" && !job.recipientEmail) {
        throw ApiError_1.ApiError.badRequest("Email recipient is required for email notifications");
    }
    if ((channel === "SMS" || channel === "WHATSAPP") && !job.recipientPhone) {
        throw ApiError_1.ApiError.badRequest("Phone number is required for SMS or WhatsApp notifications");
    }
};
const sendThroughChannel = async (channel, job) => {
    if (!job.body) {
        throw ApiError_1.ApiError.badRequest("Notification body is required");
    }
    switch (channel) {
        case "EMAIL":
            return email_1.emailService.sendEmail({
                to: job.recipientEmail,
                subject: job.subject ?? "",
                text: job.body,
                html: job.body,
            });
        case "SMS":
            return twilio_1.twilioService.sendSmsMessage(job.recipientPhone, job.body);
        case "WHATSAPP":
            return twilio_1.twilioService.sendWhatsappMessage(job.recipientPhone, job.body);
        default:
            throw new Error(`Unsupported notification channel: ${channel}`);
    }
};
const computeRetryDelay = (attempt) => DEFAULT_RETRY_BASE_MS * Math.min(4, attempt);
exports.notificationService = {
    createTemplate: async (data) => notification_repository_1.notificationRepository.createTemplate({
        name: data.name,
        slug: data.slug,
        type: data.type,
        channel: data.channel,
        subject: data.subject,
        body: data.body,
        tokens: data.tokens,
        metadata: data.metadata,
        createdBy: data.actorId ? { connect: { id: data.actorId } } : undefined,
    }),
    listTemplates: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            notification_repository_1.notificationRepository.listTemplates({ skip, take: limit, search: params?.search }),
            notification_repository_1.notificationRepository.countTemplates({ search: params?.search }),
        ]);
        return { data, meta: (0, pagination_1.calculatePagination)(total, page, limit) };
    },
    scheduleNotification: async (input) => {
        const template = input.templateSlug
            ? await notification_repository_1.notificationRepository.findTemplateBySlug(input.templateSlug)
            : null;
        if (input.templateSlug && !template) {
            throw ApiError_1.ApiError.notFound("Notification template not found");
        }
        const tokens = input.tokens ?? template?.tokens;
        const channel = input.channel ?? template?.channel ?? "EMAIL";
        const type = input.type ?? template?.type ?? "REMINDER";
        const subjectTemplate = input.subject ?? template?.subject ?? "";
        const bodyTemplate = input.body ?? template?.body ?? "";
        const renderedSubject = renderContent(subjectTemplate, tokens);
        const renderedBody = renderContent(bodyTemplate, tokens);
        const scheduledAt = input.sendNow ? new Date() : input.scheduledAt ?? new Date();
        const initialStatus = scheduledAt <= new Date() ? "QUEUED" : "SCHEDULED";
        ensureRecipientForChannel(channel, {
            recipientEmail: input.recipientEmail,
            recipientPhone: input.recipientPhone,
        });
        const job = await notification_repository_1.notificationRepository.createJob({
            template: template ? { connect: { id: template.id } } : undefined,
            type,
            channel,
            priority: input.priority ?? "NORMAL",
            status: initialStatus,
            subject: renderedSubject,
            body: renderedBody,
            payload: tokens,
            metadata: input.metadata,
            scheduledAt,
            recipientName: input.recipientName,
            recipientEmail: input.recipientEmail,
            recipientPhone: input.recipientPhone,
            booking: input.bookingId ? { connect: { id: input.bookingId } } : undefined,
            user: input.userId ? { connect: { id: input.userId } } : undefined,
            createdBy: input.actorId ? { connect: { id: input.actorId } } : undefined,
        });
        if (input.sendNow || initialStatus === "QUEUED") {
            void exports.notificationService.processJob(job.id);
        }
        return job;
    },
    listJobs: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            notification_repository_1.notificationRepository.listJobs({
                skip,
                take: limit,
                status: params?.status,
                type: params?.type,
                search: params?.search,
            }),
            notification_repository_1.notificationRepository.countJobs({
                status: params?.status,
                type: params?.type,
                search: params?.search,
            }),
        ]);
        return { data, meta: (0, pagination_1.calculatePagination)(total, page, limit) };
    },
    processJob: async (jobId) => {
        const job = await notification_repository_1.notificationRepository.findJobById(jobId);
        if (!job) {
            throw ApiError_1.ApiError.notFound("Notification job not found");
        }
        return exports.notificationService.dispatchJob(job);
    },
    dispatchJob: async (job) => {
        if (!job) {
            return { success: false, status: "FAILED" };
        }
        ensureRecipientForChannel(job.channel, job);
        try {
            const response = await sendThroughChannel(job.channel, job);
            await Promise.all([
                notification_repository_1.notificationRepository.updateJob(job.id, {
                    status: "SENT",
                    sentAt: new Date(),
                    processedAt: new Date(),
                    error: null,
                }),
                notification_repository_1.notificationRepository.logAttempt({
                    job: { connect: { id: job.id } },
                    status: "SENT",
                    channel: job.channel,
                    response: response,
                }),
            ]);
            return { success: true, status: "SENT" };
        }
        catch (error) {
            const attempts = job.attempts + 1;
            const maxAttempts = config_1.config.notificationScheduler.maxAttempts;
            const failedPermanently = attempts >= maxAttempts;
            const nextStatus = failedPermanently ? "FAILED" : "QUEUED";
            const retryDelay = failedPermanently ? null : computeRetryDelay(attempts);
            const nextScheduledAt = retryDelay ? new Date(Date.now() + retryDelay) : job.scheduledAt;
            const errorMessage = error instanceof Error ? error.message : "Unknown notification error";
            await Promise.all([
                notification_repository_1.notificationRepository.updateJob(job.id, {
                    attempts,
                    status: nextStatus,
                    scheduledAt: nextScheduledAt,
                    error: errorMessage,
                    processedAt: new Date(),
                }),
                notification_repository_1.notificationRepository.logAttempt({
                    job: { connect: { id: job.id } },
                    status: "FAILED",
                    channel: job.channel,
                    error: errorMessage,
                }),
            ]);
            return { success: false, status: nextStatus };
        }
    },
    processDueJobs: async (limit) => {
        const batchSize = limit ?? config_1.config.notificationScheduler.batchSize;
        const jobs = await notification_repository_1.notificationRepository.findDueJobs(batchSize);
        for (const job of jobs) {
            await exports.notificationService.dispatchJob(job);
        }
        return jobs.length;
    },
    triggerSos: async (input) => {
        if (!input.recipientPhone && !input.recipientEmail) {
            throw ApiError_1.ApiError.badRequest("SOS notification requires a recipient phone or email");
        }
        const channel = input.recipientPhone ? "WHATSAPP" : "EMAIL";
        return exports.notificationService.scheduleNotification({
            type: "SOS",
            channel,
            priority: "CRITICAL",
            subject: input.recipientEmail ? "Critical Assistance Needed" : undefined,
            body: input.message,
            tokens: { message: input.message },
            sendNow: true,
            recipientEmail: input.recipientEmail,
            recipientPhone: input.recipientPhone,
            bookingId: input.bookingId,
            actorId: input.actorId,
        });
    },
};
//# sourceMappingURL=notification.service.js.map