import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { connectTestDB, clearTestDB, closeTestDB } from "../helpers/db";

let authToken: string;
let otherAuthToken: string;

beforeAll(async () => {
    await connectTestDB();
});

beforeEach(async () => {
    await clearTestDB();

    const user1Res = await request(app).post("/api/auth/register").send({
        name: "Primary User",
        email: "primary@example.com",
        password: "password123",
    });
    authToken = user1Res.body.token;

    const user2Res = await request(app).post("/api/auth/register").send({
        name: "Secondary User",
        email: "secondary@example.com",
        password: "password123",
    });
    otherAuthToken = user2Res.body.token;
});

afterAll(async () => {
    await closeTestDB();
});

describe("Expenses API (/api/expenses)", () => {
    describe("Authentication guard", () => {
        it("GET /api/expenses returns 401 without an auth token", async () => {
            const res = await request(app).get("/api/expenses");
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/expenses", () => {
        it("creates a new expense for the authenticated user", async () => {
            const res = await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    title: "Lunch",
                    amount: 18.5,
                    category: "Food",
                    type: "expense",
                    note: "Cafe downtown",
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toMatchObject({
                title: "Lunch",
                amount: 18.5,
                category: "Food",
                type: "expense",
                note: "Cafe downtown",
            });
            expect(res.body.data.id).toBeDefined();
        });

        it("returns 400 when payload fails Joi validation", async () => {
            const res = await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    title: "Bad Expense",
                    amount: -10,
                    category: "InvalidCat",
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/expenses", () => {
        beforeEach(async () => {
            const payloads = [
                { title: "Salary", amount: 5000, category: "Salary", type: "income", date: "2026-03-01T00:00:00.000Z" },
                { title: "Rent", amount: 1500, category: "Rent", type: "expense", date: "2026-03-02T00:00:00.000Z" },
                { title: "Grocery Market", amount: 120, category: "Food", type: "expense", date: "2026-03-05T00:00:00.000Z" },
            ];
            for (const body of payloads) {
                await request(app)
                    .post("/api/expenses")
                    .set("Authorization", `Bearer ${authToken}`)
                    .send(body);
            }
            // Expense belonging to another user (should never leak)
            await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${otherAuthToken}`)
                .send({ title: "Other User Expense", amount: 99, category: "Food", type: "expense" });
        });

        it("returns only the authenticated user's expenses", async () => {
            const res = await request(app)
                .get("/api/expenses")
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.total).toBe(3);
        });

        it("supports category, type, search, sorting, and pagination query params", async () => {
            const filtered = await request(app)
                .get("/api/expenses?category=Food&search=grocery")
                .set("Authorization", `Bearer ${authToken}`);

            expect(filtered.status).toBe(200);
            expect(filtered.body.total).toBe(1);
            expect(filtered.body.data[0].title).toBe("Grocery Market");

            const sortedPaginated = await request(app)
                .get("/api/expenses?sortBy=amount&sortOrder=desc&page=1&limit=2")
                .set("Authorization", `Bearer ${authToken}`);

            expect(sortedPaginated.status).toBe(200);
            expect(sortedPaginated.body.total).toBe(3);
            expect(sortedPaginated.body.totalPages).toBe(2);
            expect(sortedPaginated.body.data.map((e: { amount: number }) => e.amount)).toEqual([5000, 1500]);
        });
    });

    describe("PUT /api/expenses/:id", () => {
        it("updates an expense owned by the authenticated user", async () => {
            const created = await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ title: "Taxi", amount: 20, category: "Transport", type: "expense" });

            const expenseId = created.body.data.id;

            const res = await request(app)
                .put(`/api/expenses/${expenseId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({ title: "Uber", amount: 25 });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe("Uber");
            expect(res.body.data.amount).toBe(25);
        });

        it("returns 403 when updating another user's expense", async () => {
            const created = await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ title: "Private", amount: 50, category: "Other", type: "expense" });

            const res = await request(app)
                .put(`/api/expenses/${created.body.data.id}`)
                .set("Authorization", `Bearer ${otherAuthToken}`)
                .send({ title: "Hijacked" });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it("returns 404 when updating a non-existent expense", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .put(`/api/expenses/${fakeId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({ title: "Updated" });

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("returns 400 for an invalid ObjectId format", async () => {
            const res = await request(app)
                .put("/api/expenses/not-a-valid-id")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ title: "Updated" });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Invalid ID format");
        });
    });

    describe("DELETE /api/expenses/:id", () => {
        it("deletes an expense owned by the authenticated user", async () => {
            const created = await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ title: "Snacks", amount: 12, category: "Food", type: "expense" });

            const expenseId = created.body.data.id;

            const delRes = await request(app)
                .delete(`/api/expenses/${expenseId}`)
                .set("Authorization", `Bearer ${authToken}`);

            expect(delRes.status).toBe(200);
            expect(delRes.body.success).toBe(true);

            const listRes = await request(app)
                .get("/api/expenses")
                .set("Authorization", `Bearer ${authToken}`);

            expect(listRes.body.total).toBe(0);
        });

        it("returns 403 when deleting another user's expense", async () => {
            const created = await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ title: "Protected", amount: 100, category: "Rent", type: "expense" });

            const res = await request(app)
                .delete(`/api/expenses/${created.body.data.id}`)
                .set("Authorization", `Bearer ${otherAuthToken}`);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it("returns 404 when deleting a non-existent expense", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .delete(`/api/expenses/${fakeId}`)
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/expenses/stats", () => {
        it("returns accurate monthly totals, balance, category breakdown, trend, and recent transactions", async () => {
            const nowIso = new Date().toISOString();

            await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ title: "Paycheck", amount: 4000, category: "Salary", type: "income", date: nowIso });

            await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ title: "Rent", amount: 1200, category: "Rent", type: "expense", date: nowIso });

            await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ title: "Groceries", amount: 300, category: "Food", type: "expense", date: nowIso });

            const res = await request(app)
                .get("/api/expenses/stats")
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.monthlyIncome).toBe(4000);
            expect(res.body.data.monthlyExpenses).toBe(1500);
            expect(res.body.data.totalBalance).toBe(2500);
            expect(res.body.data.categoryBreakdown).toHaveLength(2);
            expect(res.body.data.categoryBreakdown[0]).toMatchObject({
                category: "Rent",
                amount: 1200,
            });
            expect(res.body.data.spendingTrend.length).toBeGreaterThanOrEqual(1);
            expect(res.body.data.recentTransactions).toHaveLength(3);
        });
    });
});

