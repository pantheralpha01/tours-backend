
import request from 'supertest';
import express from 'express';
import { dispatchRoutes } from '../dispatch.routes';
import { vi, describe, it, expect } from 'vitest';


vi.mock('../dispatch.service', () => ({
  dispatchService: {
    create: vi.fn().mockResolvedValue({ id: '11111111-1111-1111-1111-111111111111', bookingId: '11111111-1111-1111-1111-111111111111', status: 'PENDING' }),
    list: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, limit: 10 }),
    getById: vi.fn().mockResolvedValue({ id: '11111111-1111-1111-1111-111111111111', bookingId: '11111111-1111-1111-1111-111111111111', status: 'PENDING', assignedToId: '11111111-1111-1111-1111-111111111111', booking: { agentId: 'uuid' } }),
    update: vi.fn().mockResolvedValue({ id: '11111111-1111-1111-1111-111111111111', bookingId: '11111111-1111-1111-1111-111111111111', status: 'IN_PROGRESS' }),
    remove: vi.fn().mockResolvedValue(undefined),
    addTrackPoint: vi.fn().mockResolvedValue({ latitude: 1, longitude: 2 }),
    listTrackPoints: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, limit: 10 }),
    listTimeline: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, limit: 50 }),
  }
}));

vi.mock('../bookings/booking.service', () => ({
  bookingService: {
    getById: vi.fn((id) => {
      if (id === '11111111-1111-1111-1111-111111111111') {
        return Promise.resolve({ id, agentId: id });
      }
      return Promise.resolve(undefined);
    }),
  }
}));

vi.mock('../../middleware/auth', () => ({ authenticate: (req: any, _res: any, next: any) => { req.user = { id: '11111111-1111-1111-1111-111111111111', role: 'ADMIN' }; next(); } }));
vi.mock('../../middleware/role', () => ({ requireRoles: () => (_req: any, _res: any, next: any) => next() }));

const app = express();
app.use(express.json());
app.use('/api/dispatches', dispatchRoutes);

describe('Dispatch Routes', () => {
  it('POST /api/dispatches - create dispatch', async () => {
    const res = await request(app)
      .post('/api/dispatches')
      .send({ bookingId: '11111111-1111-1111-1111-111111111111', assignedToId: '11111111-1111-1111-1111-111111111111' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('GET /api/dispatches - list dispatches', async () => {
    const res = await request(app)
      .get('/api/dispatches?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
  });

  it('GET /api/dispatches/:id - get dispatch by id', async () => {
    const res = await request(app)
      .get('/api/dispatches/11111111-1111-1111-1111-111111111111');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('PUT /api/dispatches/:id - update dispatch', async () => {
    const res = await request(app)
      .put('/api/dispatches/11111111-1111-1111-1111-111111111111')
      .send({ status: 'IN_PROGRESS' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('IN_PROGRESS');
  });

  it('DELETE /api/dispatches/:id - delete dispatch', async () => {
    const res = await request(app)
      .delete('/api/dispatches/11111111-1111-1111-1111-111111111111');
    expect(res.status).toBe(204);
  });

  it('POST /api/dispatches/:id/track - add track point', async () => {
    const res = await request(app)
      .post('/api/dispatches/11111111-1111-1111-1111-111111111111/track')
      .send({ latitude: 1, longitude: 2 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('latitude');
  });

  it('GET /api/dispatches/:id/track - list track points', async () => {
    const res = await request(app)
      .get('/api/dispatches/11111111-1111-1111-1111-111111111111/track?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
  });

  it('GET /api/dispatches/:id/timeline - get timeline', async () => {
    const res = await request(app)
      .get('/api/dispatches/11111111-1111-1111-1111-111111111111/timeline?page=1&limit=50');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
  });
});
