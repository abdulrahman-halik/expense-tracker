import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

let mongoServer: MongoMemoryServer;
let authToken: string;

beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const registerRes = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Test User",
            email: "testuser@example.com",
            password: "password123",
        });

    authToken = registerRes.body.token;
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe("Expenses API", () => {
    it("GET /api/expenses - should return 401 without an auth token", async () => {
        const response = await request(app).get("/api/expenses");
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    it("GET /api/expenses - should return all expenses for authenticated user", async () => {
        const response = await request(app)
            .get("/api/expenses")
            .set("Authorization", `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
    });
});

