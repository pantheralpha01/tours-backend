"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchTrackRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.dispatchTrackRepository = {
    create: (data) => prisma_1.prisma.dispatchTrackPoint.create({
        data: {
            dispatchId: data.dispatchId,
            latitude: data.latitude,
            longitude: data.longitude,
            recordedAt: data.recordedAt ?? new Date(),
            metadata: data.metadata ? data.metadata : null,
        },
    }),
    findMany: (params) => {
        const where = { dispatchId: params.dispatchId };
        if (params.dateFrom || params.dateTo) {
            where.recordedAt = {};
            if (params.dateFrom)
                where.recordedAt.gte = params.dateFrom;
            if (params.dateTo)
                where.recordedAt.lte = params.dateTo;
        }
        return prisma_1.prisma.dispatchTrackPoint.findMany({
            where,
            orderBy: { recordedAt: "desc" },
            skip: params.skip,
            take: params.take,
        });
    },
    count: (params) => {
        const where = { dispatchId: params.dispatchId };
        if (params.dateFrom || params.dateTo) {
            where.recordedAt = {};
            if (params.dateFrom)
                where.recordedAt.gte = params.dateFrom;
            if (params.dateTo)
                where.recordedAt.lte = params.dateTo;
        }
        return prisma_1.prisma.dispatchTrackPoint.count({ where });
    },
};
//# sourceMappingURL=dispatch-track.repository.js.map