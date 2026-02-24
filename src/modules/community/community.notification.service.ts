import { CommunityPost, CommunitySubscriptionFrequency } from "@prisma/client";
import { config } from "../../config";
import { notificationService } from "../notifications/notification.service";
import { communityRepository } from "./community.repository";

const buildPostUrl = (slug?: string | null) => {
  if (!slug || !config.community.publicBaseUrl) {
    return null;
  }
  return `${config.community.publicBaseUrl.replace(/\/$/, "")}/posts/${slug}`;
};

const formatExcerpt = (post: { content: string; excerpt?: string | null }) => {
  if (post.excerpt) {
    return post.excerpt;
  }
  return post.content.length > 240 ? `${post.content.slice(0, 237)}...` : post.content;
};

const renderInstantBody = (options: {
  subscriberName?: string | null;
  authorName?: string | null;
  postTitle: string;
  topicName?: string | null;
  excerpt: string;
  postUrl?: string | null;
}) => {
  const lines = [
    `Hi ${options.subscriberName ?? "there"},`,
    "",
    `${options.authorName ?? "Someone"} just published "${options.postTitle}"${
      options.topicName ? ` in ${options.topicName}` : ""
    }.`,
    "",
    options.excerpt,
  ];
  if (options.postUrl) {
    lines.push("", `Read more: ${options.postUrl}`);
  }
  lines.push("", "You are receiving this because you subscribed to community updates.");
  return lines.join("\n");
};

const renderDigestBody = (options: {
  subscriberName?: string | null;
  posts: Array<{
    title: string;
    topicName?: string | null;
    authorName?: string | null;
    postUrl?: string | null;
    excerpt: string;
    publishedAt?: Date | null;
  }>;
}) => {
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

export const communityNotificationService = {
  notifyPostPublished: async (post: CommunityPost & {
    author: { id: string; name: string | null };
    topic?: { id: string; name: string | null; slug: string | null } | null;
  }) => {
    const subscribers = await communityRepository.listSubscribersForPost({
      postId: post.id,
      topicId: post.topicId,
      frequency: CommunitySubscriptionFrequency.INSTANT,
    });

    if (!subscribers.length) {
      return 0;
    }

    const postUrl = buildPostUrl(post.slug);
    const excerpt = formatExcerpt(post);
    const sentTo = new Set<string>();
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

      await notificationService.scheduleNotification({
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

  sendDailyDigest: async (options?: { sinceHours?: number; actorId?: string }) => {
    const sinceHours = options?.sinceHours ?? 24;
    const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000);
    const posts = await communityRepository.findPostsPublishedSince(since);
    if (!posts.length) {
      return { scheduled: 0, since };
    }

    const subscribers = await communityRepository.listDigestSubscribers();
    if (!subscribers.length) {
      return { scheduled: 0, since };
    }

    const grouped = new Map<string, { email: string; name?: string | null; posts: Map<string, CommunityPost> }>();

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
        posts: new Map<string, CommunityPost>(),
      };

      matches.forEach((match) => entry.posts.set(match.id, match));
      grouped.set(sub.userId, entry);
    }

    let scheduled = 0;

    for (const [userId, entry] of grouped.entries()) {
      const digestPosts = Array.from(entry.posts.values()).map((post) => ({
        title: post.title,
        topicName: post.topic?.name,
        authorName: post.author?.name,
        excerpt: formatExcerpt(post),
        postUrl: buildPostUrl(post.slug),
        publishedAt: post.publishedAt,
      }));

      await notificationService.scheduleNotification({
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
