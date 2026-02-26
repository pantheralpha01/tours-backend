"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityNotificationService = void 0;
const client_1 = require("@prisma/client");
const config_1 = require("../../config");
const notification_service_1 = require("../notifications/notification.service");
const community_repository_1 = require("./community.repository");
const buildPostUrl = (slug) => {
    if (!slug || !config_1.config.community.publicBaseUrl) {
        return null;
    }
    return `${config_1.config.community.publicBaseUrl.replace(/\/$/, "")}/posts/${slug}`;
};
const formatExcerpt = (post) => {
    if (post.excerpt) {
        return post.excerpt;
    }
    return post.content.length > 240 ? `${post.content.slice(0, 237)}...` : post.content;
};
const renderInstantBody = (options) => {
    const lines = [
        `Hi ${options.subscriberName ?? "there"},`,
        "",
        `${options.authorName ?? "Someone"} just published "${options.postTitle}"${options.topicName ? ` in ${options.topicName}` : ""}.`,
        "",
        options.excerpt,
    ];
    if (options.postUrl) {
        lines.push("", `Read more: ${options.postUrl}`);
    }
    lines.push("", "You are receiving this because you subscribed to community updates.");
    return lines.join("\n");
};
const renderDigestBody = (options) => {
    const header = [`Hi ${options.subscriberName ?? "there"},`, "", "Here's your latest community digest:", ""];
    const entries = options.posts.map((post, index) => {
        const parts = [
            `${index + 1}. ${post.title}${post.topicName ? ` (${post.topicName})` : ""} — ${post.authorName ?? "An agent"}`,
            `   ${post.excerpt}`,
        ];
        if (post.postUrl) {
            parts.push(`   Read more: ${post.postUrl}`);
        }
        return parts.join("\n");
    });
    return [...header, ...entries, "", "You can update your subscription preferences anytime."].join("\n");
};
exports.communityNotificationService = {
    notifyPostPublished: async (post) => {
        const subscribers = await community_repository_1.communityRepository.listSubscribersForPost({
            postId: post.id,
            topicId: post.topicId,
            frequency: client_1.CommunitySubscriptionFrequency.INSTANT,
        });
        if (!subscribers.length) {
            return 0;
        }
        const postUrl = buildPostUrl(post.slug);
        const excerpt = formatExcerpt(post);
        const sentTo = new Set();
        let scheduled = 0;
        for (const subscription of subscribers) {
            if (!subscription.user?.email) {
                continue;
            }
            if (subscription.userId === post.authorId) {
                continue;
            }
            if (sentTo.has(subscription.userId)) {
                continue;
            }
            await notification_service_1.notificationService.scheduleNotification({
                type: "COMMUNITY",
                channel: "EMAIL",
                priority: "NORMAL",
                subject: `[Community] ${post.title}`,
                body: renderInstantBody({
                    subscriberName: subscription.user?.name,
                    authorName: post.author?.name,
                    postTitle: post.title,
                    topicName: post.topic?.name,
                    excerpt,
                    postUrl,
                }),
                sendNow: true,
                recipientEmail: subscription.user.email,
                userId: subscription.user.id,
                metadata: {
                    subscriptionId: subscription.id,
                    postId: post.id,
                    topicId: post.topicId,
                },
            });
            sentTo.add(subscription.userId);
            scheduled += 1;
        }
        return scheduled;
    },
    sendDailyDigest: async (options) => {
        const sinceHours = options?.sinceHours ?? 24;
        const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000);
        const posts = await community_repository_1.communityRepository.findPostsPublishedSince(since);
        if (!posts.length) {
            return { scheduled: 0, since };
        }
        const subscribers = await community_repository_1.communityRepository.listDigestSubscribers();
        if (!subscribers.length) {
            return { scheduled: 0, since };
        }
        const grouped = new Map();
        for (const sub of subscribers) {
            if (!sub.user?.email) {
                continue;
            }
            const matches = posts.filter((post) => {
                if (sub.postId) {
                    return post.id === sub.postId;
                }
                if (sub.topicId) {
                    return post.topicId === sub.topicId;
                }
                return true;
            });
            if (!matches.length) {
                continue;
            }
            const entry = grouped.get(sub.userId) ?? {
                email: sub.user.email,
                name: sub.user.name,
                posts: new Map(),
            };
            matches.forEach((match) => entry.posts.set(match.id, match));
            grouped.set(sub.userId, entry);
        }
        let scheduled = 0;
        for (const [userId, entry] of grouped.entries()) {
            const digestPosts = Array.from(entry.posts.values()).map((post) => ({
                title: post.title,
                topicName: post.topicId ?? '',
                authorName: post.authorId ?? '',
                excerpt: formatExcerpt(post),
                postUrl: buildPostUrl(post.slug),
                publishedAt: post.publishedAt,
            }));
            await notification_service_1.notificationService.scheduleNotification({
                type: "COMMUNITY",
                channel: "EMAIL",
                priority: "NORMAL",
                subject: `Your community digest (${digestPosts.length} update${digestPosts.length === 1 ? "" : "s"})`,
                body: renderDigestBody({ subscriberName: entry.name, posts: digestPosts }),
                sendNow: true,
                recipientEmail: entry.email,
                userId,
                metadata: {
                    digestSince: since.toISOString(),
                    postCount: digestPosts.length,
                },
                actorId: options?.actorId,
            });
            scheduled += 1;
        }
        return { scheduled, since };
    },
};
//# sourceMappingURL=community.notification.service.js.map