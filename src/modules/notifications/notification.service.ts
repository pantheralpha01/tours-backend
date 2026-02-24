import {
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from "@prisma/client";
import { notificationRepository } from "./notification.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { emailService } from "../../integrations/email";
import { twilioService } from "../../integrations/twilio";
import { config } from "../../config";
import { ApiError } from "../../utils/ApiError";

const TOKEN_REGEX = /\{\{\s*(\w+)\s*\}\}/g;
const DEFAULT_RETRY_BASE_MS = 60_000;

const renderContent = (template: string | null | undefined, tokens?: Record<string, unknown>) => {
  if (!template) {
    return "";
  }
  if (!tokens) {
    return template;
  }

  return template.replace(TOKEN_REGEX, (_match, key: string) => {
    const value = tokens[key];
    return value === undefined || value === null ? "" : String(value);
  });
};

const ensureRecipientForChannel = (channel: NotificationChannel, job: { recipientEmail?: string | null; recipientPhone?: string | null }) => {
  if (channel === "EMAIL" && !job.recipientEmail) {
    throw ApiError.badRequest("Email recipient is required for email notifications");
  }
  if ((channel === "SMS" || channel === "WHATSAPP") && !job.recipientPhone) {
    throw ApiError.badRequest("Phone number is required for SMS or WhatsApp notifications");
  }
};

const sendThroughChannel = async (
  channel: NotificationChannel,
  job: {
    recipientEmail?: string | null;
    recipientPhone?: string | null;
    subject?: string | null;
    body?: string | null;
  }
) => {
  if (!job.body) {
    throw ApiError.badRequest("Notification body is required");
  }

  switch (channel) {
    case "EMAIL":
      return emailService.sendEmail({
        to: job.recipientEmail!,
        subject: job.subject ?? "",
        text: job.body,
        html: job.body,
      });
    case "SMS":
      return twilioService.sendSmsMessage(job.recipientPhone!, job.body);
    case "WHATSAPP":
      return twilioService.sendWhatsappMessage(job.recipientPhone!, job.body);
    default:
      throw new Error(`Unsupported notification channel: ${channel}`);
  }
};

const computeRetryDelay = (attempt: number) => DEFAULT_RETRY_BASE_MS * Math.min(4, attempt);

export const notificationService = {
  createTemplate: async (data: {
    name: string;
    slug: string;
    type: NotificationType;
    channel: NotificationChannel;
    subject?: string | null;
    body: string;
    tokens?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    actorId?: string;
  }) =>
    notificationRepository.createTemplate({
      name: data.name,
      slug: data.slug,
      type: data.type,
      channel: data.channel,
      subject: data.subject,
      body: data.body,
      tokens: data.tokens as any,
      metadata: data.metadata as any,
      createdBy: data.actorId ? { connect: { id: data.actorId } } : undefined,
    }),

  listTemplates: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      notificationRepository.listTemplates({ skip, take: limit, search: params?.search }),
      notificationRepository.countTemplates({ search: params?.search }),
    ]);

    return { data, meta: calculatePagination(total, page, limit) };
  },

  scheduleNotification: async (input: {
    templateSlug?: string;
    type?: NotificationType;
    channel?: NotificationChannel;
    priority?: NotificationPriority;
    subject?: string;
    body?: string;
    tokens?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    scheduledAt?: Date;
    sendNow?: boolean;
    recipientName?: string;
    recipientEmail?: string;
    recipientPhone?: string;
    bookingId?: string;
    userId?: string;
    actorId?: string;
  }) => {
    const template = input.templateSlug
      ? await notificationRepository.findTemplateBySlug(input.templateSlug)
      : null;

    if (input.templateSlug && !template) {
      throw ApiError.notFound("Notification template not found");
    }

    const tokens = input.tokens ?? (template?.tokens as Record<string, unknown> | undefined);
    const channel = input.channel ?? template?.channel ?? "EMAIL";
    const type = input.type ?? template?.type ?? "REMINDER";

    const subjectTemplate = input.subject ?? template?.subject ?? "";
    const bodyTemplate = input.body ?? template?.body ?? "";

    const renderedSubject = renderContent(subjectTemplate, tokens);
    const renderedBody = renderContent(bodyTemplate, tokens);

    const scheduledAt = input.sendNow ? new Date() : input.scheduledAt ?? new Date();
    const initialStatus: NotificationStatus = scheduledAt <= new Date() ? "QUEUED" : "SCHEDULED";

    ensureRecipientForChannel(channel, {
      recipientEmail: input.recipientEmail,
      recipientPhone: input.recipientPhone,
    });

    const job = await notificationRepository.createJob({
      template: template ? { connect: { id: template.id } } : undefined,
      type,
      channel,
      priority: input.priority ?? "NORMAL",
      status: initialStatus,
      subject: renderedSubject,
      body: renderedBody,
      payload: tokens as any,
      metadata: input.metadata as any,
      scheduledAt,
      recipientName: input.recipientName,
      recipientEmail: input.recipientEmail,
      recipientPhone: input.recipientPhone,
      booking: input.bookingId ? { connect: { id: input.bookingId } } : undefined,
      user: input.userId ? { connect: { id: input.userId } } : undefined,
      createdBy: input.actorId ? { connect: { id: input.actorId } } : undefined,
    });

    if (input.sendNow || initialStatus === "QUEUED") {
      void notificationService.processJob(job.id);
    }

    return job;
  },

  listJobs: async (params?: {
    page?: number;
    limit?: number;
    status?: NotificationStatus;
    type?: NotificationType;
    search?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      notificationRepository.listJobs({
        skip,
        take: limit,
        status: params?.status,
        type: params?.type,
        search: params?.search,
      }),
      notificationRepository.countJobs({
        status: params?.status,
        type: params?.type,
        search: params?.search,
      }),
    ]);

    return { data, meta: calculatePagination(total, page, limit) };
  },

  processJob: async (jobId: string) => {
    const job = await notificationRepository.findJobById(jobId);
    if (!job) {
      throw ApiError.notFound("Notification job not found");
    }
    return notificationService.dispatchJob(job);
  },

  dispatchJob: async (
    job: Awaited<ReturnType<typeof notificationRepository.findJobById>>
  ): Promise<{ success: boolean; status: NotificationStatus }> => {
    if (!job) {
      return { success: false, status: "FAILED" };
    }

    ensureRecipientForChannel(job.channel, job);

    try {
      const response = await sendThroughChannel(job.channel, job);
      await Promise.all([
        notificationRepository.updateJob(job.id, {
          status: "SENT",
          sentAt: new Date(),
          processedAt: new Date(),
          error: null,
        }),
        notificationRepository.logAttempt({
          job: { connect: { id: job.id } },
          status: "SENT",
          channel: job.channel,
          response: response as any,
        }),
      ]);
      return { success: true, status: "SENT" };
    } catch (error) {
      const attempts = job.attempts + 1;
      const maxAttempts = config.notificationScheduler.maxAttempts;
      const failedPermanently = attempts >= maxAttempts;
      const nextStatus: NotificationStatus = failedPermanently ? "FAILED" : "QUEUED";
      const retryDelay = failedPermanently ? null : computeRetryDelay(attempts);
      const nextScheduledAt = retryDelay ? new Date(Date.now() + retryDelay) : job.scheduledAt;
      const errorMessage = error instanceof Error ? error.message : "Unknown notification error";

      await Promise.all([
        notificationRepository.updateJob(job.id, {
          attempts,
          status: nextStatus,
          scheduledAt: nextScheduledAt,
          error: errorMessage,
          processedAt: new Date(),
        }),
        notificationRepository.logAttempt({
          job: { connect: { id: job.id } },
          status: "FAILED",
          channel: job.channel,
          error: errorMessage,
        }),
      ]);

      return { success: false, status: nextStatus };
    }
  },

  processDueJobs: async (limit?: number) => {
    const batchSize = limit ?? config.notificationScheduler.batchSize;
    const jobs = await notificationRepository.findDueJobs(batchSize);

    for (const job of jobs) {
      await notificationService.dispatchJob(job);
    }

    return jobs.length;
  },

  triggerSos: async (input: {
    message: string;
    recipientPhone?: string;
    recipientEmail?: string;
    bookingId?: string;
    actorId?: string;
  }) => {
    if (!input.recipientPhone && !input.recipientEmail) {
      throw ApiError.badRequest("SOS notification requires a recipient phone or email");
    }

    const channel = input.recipientPhone ? "WHATSAPP" : "EMAIL";

    return notificationService.scheduleNotification({
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
