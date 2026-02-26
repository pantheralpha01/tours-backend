"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityController = void 0;
const ApiError_1 = require("../../utils/ApiError");
const community_service_1 = require("./community.service");
const community_validation_1 = require("./community.validation");
exports.communityController = {
    createTopic: async (req, res) => {
        const payload = community_validation_1.createTopicSchema.parse(req.body);
        const topic = await community_service_1.communityService.createTopic({
            ...payload,
            actorId: req.user?.id,
        });
        return res.status(201).json(topic);
    },
    listTopics: async (req, res) => {
        const params = community_validation_1.listTopicsSchema.parse(req.query);
        const topics = await community_service_1.communityService.listTopics(params);
        return res.status(200).json(topics);
    },
    updateTopic: async (req, res) => {
        const { id } = community_validation_1.topicIdParamSchema.parse(req.params);
        const payload = community_validation_1.updateTopicSchema.parse(req.body);
        const topic = await community_service_1.communityService.updateTopic(id, payload);
        return res.status(200).json(topic);
    },
    createPost: async (req, res) => {
        if (!req.user?.id) {
            throw ApiError_1.ApiError.unauthorized("Authentication required");
        }
        const payload = community_validation_1.createPostSchema.parse(req.body);
        const privileged = req.user.role === "ADMIN" || req.user.role === "MANAGER";
        if (payload.isPinned && !privileged) {
            throw ApiError_1.ApiError.forbidden("Only managers or admins can pin posts");
        }
        const post = await community_service_1.communityService.createPost({
            ...payload,
            authorId: req.user.id,
        });
        return res.status(201).json(post);
    },
    listPosts: async (req, res) => {
        const params = community_validation_1.listPostsSchema.parse(req.query);
        const posts = await community_service_1.communityService.listPosts(params);
        return res.status(200).json(posts);
    },
    getFeed: async (req, res) => {
        const params = community_validation_1.feedQuerySchema.parse(req.query);
        const feed = await community_service_1.communityService.getFeed(params, {
            id: req.user?.id,
            role: req.user?.role,
        });
        return res.status(200).json(feed);
    },
    getPost: async (req, res) => {
        const { id } = community_validation_1.postIdParamSchema.parse(req.params);
        const post = await community_service_1.communityService.getPost(id, {
            id: req.user?.id,
            role: req.user?.role,
        });
        return res.status(200).json(post);
    },
    updatePost: async (req, res) => {
        const { id } = community_validation_1.postIdParamSchema.parse(req.params);
        const payload = community_validation_1.updatePostSchema.parse(req.body);
        const post = await community_service_1.communityService.updatePost(id, payload, {
            id: req.user?.id,
            role: req.user?.role,
        });
        return res.status(200).json(post);
    },
    deletePost: async (req, res) => {
        const { id } = community_validation_1.postIdParamSchema.parse(req.params);
        await community_service_1.communityService.deletePost(id, {
            id: req.user?.id,
            role: req.user?.role,
        });
        return res.status(204).send();
    },
    flagPost: async (req, res) => {
        if (!req.user?.id) {
            throw ApiError_1.ApiError.unauthorized("Authentication required");
        }
        const { id } = community_validation_1.postIdParamSchema.parse(req.params);
        const payload = community_validation_1.flagPostSchema.parse(req.body);
        const post = await community_service_1.communityService.flagPost(id, {
            actorId: req.user.id,
            reason: payload.reason,
        });
        return res.status(200).json(post);
    },
    moderatePost: async (req, res) => {
        const { id } = community_validation_1.postIdParamSchema.parse(req.params);
        const payload = community_validation_1.moderatePostSchema.parse(req.body);
        const post = await community_service_1.communityService.moderatePost(id, {
            status: payload.status,
            visibility: payload.visibility,
            isPinned: payload.isPinned,
            notes: payload.notes,
        }, {
            id: req.user?.id,
            role: req.user?.role,
        });
        return res.status(200).json(post);
    },
    reactToPost: async (req, res) => {
        if (!req.user?.id) {
            throw ApiError_1.ApiError.unauthorized("Authentication required");
        }
        const { id } = community_validation_1.postIdParamSchema.parse(req.params);
        const payload = community_validation_1.reactionSchema.parse(req.body);
        const result = await community_service_1.communityService.reactToPost(id, {
            userId: req.user.id,
            role: req.user.role,
            type: payload.type,
        });
        return res.status(200).json(result);
    },
    addComment: async (req, res) => {
        if (!req.user?.id) {
            throw ApiError_1.ApiError.unauthorized("Authentication required");
        }
        const { id } = community_validation_1.postIdParamSchema.parse(req.params);
        const payload = community_validation_1.commentSchema.parse(req.body);
        const comment = await community_service_1.communityService.addComment(id, {
            userId: req.user.id,
            role: req.user.role,
            content: payload.content,
            parentId: payload.parentId,
        });
        return res.status(201).json(comment);
    },
    listComments: async (req, res) => {
        const { id } = community_validation_1.postIdParamSchema.parse(req.params);
        await community_service_1.communityService.getPost(id, {
            id: req.user?.id,
            role: req.user?.role,
        });
        const comments = await community_service_1.communityService.listComments(id);
        return res.status(200).json(comments);
    },
    listSubscriptions: async (req, res) => {
        const subscriptions = await community_service_1.communityService.listSubscriptions({ id: req.user?.id });
        return res.status(200).json(subscriptions);
    },
    subscribe: async (req, res) => {
        if (!req.user?.id) {
            throw ApiError_1.ApiError.unauthorized("Authentication required");
        }
        const payload = community_validation_1.subscriptionSchema.parse(req.body);
        const subscription = await community_service_1.communityService.subscribe(payload, {
            id: req.user.id,
            role: req.user.role,
        });
        return res.status(201).json(subscription);
    },
    unsubscribe: async (req, res) => {
        if (!req.user?.id) {
            throw ApiError_1.ApiError.unauthorized("Authentication required");
        }
        const payload = community_validation_1.subscriptionTargetOnlySchema.parse(req.body);
        const result = await community_service_1.communityService.unsubscribe(payload, {
            id: req.user.id,
        });
        return res.status(200).json(result);
    },
    sendDigest: async (req, res) => {
        const payload = community_validation_1.digestTriggerSchema.parse(req.body ?? {});
        const result = await community_service_1.communityService.sendDigest(payload, {
            id: req.user?.id,
            role: req.user?.role,
        });
        return res.status(202).json(result);
    },
};
//# sourceMappingURL=community.controller.js.map