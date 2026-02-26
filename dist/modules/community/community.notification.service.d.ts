import { CommunityPost } from "@prisma/client";
export declare const communityNotificationService: {
    notifyPostPublished: (post: CommunityPost & {
        author: {
            id: string;
            name: string | null;
        };
        topic?: {
            id: string;
            name: string | null;
            slug: string | null;
        } | null;
    }) => Promise<number>;
    sendDailyDigest: (options?: {
        sinceHours?: number;
        actorId?: string;
    }) => Promise<{
        scheduled: number;
        since: Date;
    }>;
};
//# sourceMappingURL=community.notification.service.d.ts.map