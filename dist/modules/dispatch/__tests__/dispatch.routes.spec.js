"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const dispatch_routes_1 = require("../dispatch.routes");
const vitest_1 = require("vitest");
vitest_1.vi.mock('../dispatch.service', () => ({
    dispatchService: {
        create: vitest_1.vi.fn().mockResolvedValue({ id: '11111111-1111-1111-1111-111111111111', bookingId: '11111111-1111-1111-1111-111111111111', status: 'PENDING' }),
        list: vitest_1.vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, limit: 10 }),
        getById: vitest_1.vi.fn().mockResolvedValue({ id: '11111111-1111-1111-1111-111111111111', bookingId: '11111111-1111-1111-1111-111111111111', status: 'PENDING', assignedToId: '11111111-1111-1111-1111-111111111111', booking: { agentId: 'uuid' } }),
        update: vitest_1.vi.fn().mockResolvedValue({ id: '11111111-1111-1111-1111-111111111111', bookingId: '11111111-1111-1111-1111-111111111111', status: 'IN_PROGRESS' }),
        remove: vitest_1.vi.fn().mockResolvedValue(undefined),
        addTrackPoint: vitest_1.vi.fn().mockResolvedValue({ latitude: 1, longitude: 2 }),
        listTrackPoints: vitest_1.vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, limit: 10 }),
        listTimeline: vitest_1.vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, limit: 50 }),
    }
}));
vitest_1.vi.mock('../bookings/booking.service', () => ({
    bookingService: {
        getById: vitest_1.vi.fn((id) => {
            if (id === '11111111-1111-1111-1111-111111111111') {
                return Promise.resolve({ id, agentId: id });
            }
            return Promise.resolve(undefined);
        }),
    }
}));
vitest_1.vi.mock('../../middleware/auth', () => ({ authenticate: (req, _res, next) => { req.user = { id: '11111111-1111-1111-1111-111111111111', role: 'ADMIN' }; next(); } }));
vitest_1.vi.mock('../../middleware/role', () => ({ requireRoles: () => (_req, _res, next) => next() }));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/dispatches', dispatch_routes_1.dispatchRoutes);
(0, vitest_1.describe)('Dispatch Routes', () => {
    (0, vitest_1.it)('POST /api/dispatches - create dispatch', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/dispatches')
            .send({ bookingId: '11111111-1111-1111-1111-111111111111', assignedToId: '11111111-1111-1111-1111-111111111111' });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body).toHaveProperty('id');
    });
    (0, vitest_1.it)('GET /api/dispatches - list dispatches', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/api/dispatches?page=1&limit=10');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toHaveProperty('items');
    });
    (0, vitest_1.it)('GET /api/dispatches/:id - get dispatch by id', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/api/dispatches/11111111-1111-1111-1111-111111111111');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toHaveProperty('id');
    });
    (0, vitest_1.it)('PUT /api/dispatches/:id - update dispatch', async () => {
        const res = await (0, supertest_1.default)(app)
            .put('/api/dispatches/11111111-1111-1111-1111-111111111111')
            .send({ status: 'IN_PROGRESS' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.status).toBe('IN_PROGRESS');
    });
    (0, vitest_1.it)('DELETE /api/dispatches/:id - delete dispatch', async () => {
        const res = await (0, supertest_1.default)(app)
            .delete('/api/dispatches/11111111-1111-1111-1111-111111111111');
        (0, vitest_1.expect)(res.status).toBe(204);
    });
    (0, vitest_1.it)('POST /api/dispatches/:id/track - add track point', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/dispatches/11111111-1111-1111-1111-111111111111/track')
            .send({ latitude: 1, longitude: 2 });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body).toHaveProperty('latitude');
    });
    (0, vitest_1.it)('GET /api/dispatches/:id/track - list track points', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/api/dispatches/11111111-1111-1111-1111-111111111111/track?page=1&limit=10');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toHaveProperty('items');
    });
    (0, vitest_1.it)('GET /api/dispatches/:id/timeline - get timeline', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/api/dispatches/11111111-1111-1111-1111-111111111111/timeline?page=1&limit=50');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toHaveProperty('items');
    });
});
//# sourceMappingURL=dispatch.routes.spec.js.map