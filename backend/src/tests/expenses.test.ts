import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index';

let mongod: MongoMemoryServer;
let authToken: string;
let expenseId: string;

// ---------------------------------------------------------------------------
// Setup: spin up an in-memory MongoDB before all tests
// ---------------------------------------------------------------------------
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Disconnect from any existing connection (e.g., the one created in index.ts)
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    process.env.JWT_SECRET = 'test_jwt_secret_key';
    process.env.NODE_ENV = 'test';
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

afterEach(async () => {
    // Clear only expense data between tests; keep user for auth tests
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        if (key !== 'users') {
            await collections[key].deleteMany({});
        }
    }
});

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
describe('POST /api/auth/register', () => {
    it('registers a new user and returns a token', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email: 'test@expense.com', password: 'password123' });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        authToken = res.body.token;
    });

    it('rejects duplicate email with 409', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email: 'test@expense.com', password: 'password123' });

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });

    it('returns 400 for invalid payload (short password)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'A', email: 'short@test.com', password: '123' });

        expect(res.status).toBe(400);
    });
});

describe('POST /api/auth/login', () => {
    it('logs in and returns a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@expense.com', password: 'password123' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        authToken = res.body.token; // refresh token for subsequent tests
    });

    it('returns 401 for wrong credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@expense.com', password: 'wrongpass' });

        expect(res.status).toBe(401);
    });
});

// ---------------------------------------------------------------------------
// Expenses
// ---------------------------------------------------------------------------
describe('POST /api/expenses', () => {
    it('creates an expense (authenticated)', async () => {
        const res = await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Coffee', amount: 3.5, category: 'Food', date: '2024-01-10' });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Coffee');
        expenseId = res.body.data._id;
    });

    it('returns 401 without a token', async () => {
        const res = await request(app)
            .post('/api/expenses')
            .send({ title: 'No auth', amount: 10, category: 'Food' });

        expect(res.status).toBe(401);
    });

    it('returns 400 for invalid payload (negative amount)', async () => {
        const res = await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Bad', amount: -5, category: 'Food' });

        expect(res.status).toBe(400);
    });
});

describe('GET /api/expenses', () => {
    beforeEach(async () => {
        // Seed a few expenses
        await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Bus', amount: 2, category: 'Transport', date: '2024-01-08' });

        await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Gym', amount: 50, category: 'Healthcare', date: '2024-01-09' });

        await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Dinner', amount: 25, category: 'Food', date: '2024-01-10' });
    });

    it('returns all expenses with pagination metadata', async () => {
        const res = await request(app)
            .get('/api/expenses')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(typeof res.body.totalItems).toBe('number');
        expect(typeof res.body.totalPages).toBe('number');
        expect(res.body.currentPage).toBe(1);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('paginates correctly (limit=2)', async () => {
        const res = await request(app)
            .get('/api/expenses?page=1&limit=2')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeLessThanOrEqual(2);
        expect(res.body.totalPages).toBeGreaterThanOrEqual(1);
    });

    it('filters by category', async () => {
        const res = await request(app)
            .get('/api/expenses?category=Food')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        res.body.data.forEach((e: { category: string }) => {
            expect(e.category).toBe('Food');
        });
    });

    it('sorts by amount ascending', async () => {
        const res = await request(app)
            .get('/api/expenses?sortBy=amount&sortOrder=asc')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        const amounts: number[] = res.body.data.map((e: { amount: number }) => e.amount);
        for (let i = 1; i < amounts.length; i++) {
            expect(amounts[i]).toBeGreaterThanOrEqual(amounts[i - 1]);
        }
    });

    it('returns 401 without a token', async () => {
        const res = await request(app).get('/api/expenses');
        expect(res.status).toBe(401);
    });
});

describe('PUT /api/expenses/:id', () => {
    beforeEach(async () => {
        const res = await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'To update', amount: 10, category: 'Shopping' });
        expenseId = res.body.data._id;
    });

    it('updates an expense successfully', async () => {
        const res = await request(app)
            .put(`/api/expenses/${expenseId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ amount: 99 });

        expect(res.status).toBe(200);
        expect(res.body.data.amount).toBe(99);
    });

    it('returns 404 for non-existent expense', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res = await request(app)
            .put(`/api/expenses/${fakeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ amount: 5 });

        expect(res.status).toBe(404);
    });
});

describe('DELETE /api/expenses/:id', () => {
    beforeEach(async () => {
        const res = await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'To delete', amount: 5, category: 'Other' });
        expenseId = res.body.data._id;
    });

    it('deletes an expense successfully', async () => {
        const res = await request(app)
            .delete(`/api/expenses/${expenseId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('returns 404 when already deleted', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res = await request(app)
            .delete(`/api/expenses/${fakeId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(404);
    });
});
