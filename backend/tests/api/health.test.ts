import request from "supertest";
import app from "../../src/app";
import { connectTestDB, closeTestDB } from "../helpers/db";

beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

describe("System & Public Routes (API)", () => {
    it("GET / returns API running status", async () => {
        const res = await request(app).get("/");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "Expense Tracker API is running...",
        });
    });

    it("GET /health returns 200 UP when database is connected", async () => {
        const res = await request(app).get("/health");

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("UP");
        expect(res.body.database).toBe("connected");
        expect(res.body.timestamp).toBeDefined();
    });

    it("returns 404 JSON response for unknown routes", async () => {
        const res = await request(app).get("/api/does-not-exist");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "Route not found",
        });
    });
});

