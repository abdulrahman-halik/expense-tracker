import request from "supertest";
import app from "../../src/app";
import { connectTestDB, clearTestDB, closeTestDB } from "../helpers/db";

beforeAll(async () => {
    await connectTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

describe("Auth API (/api/auth)", () => {
    const validUser = {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
    };

    describe("POST /api/auth/register", () => {
        it("registers a new user and returns a JWT token", async () => {
            const res = await request(app).post("/api/auth/register").send(validUser);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(res.body.user).toMatchObject({
                name: validUser.name,
                email: validUser.email,
            });
            expect(res.body.user.password).toBeUndefined();
        });

        it("returns 400 for invalid registration input", async () => {
            const res = await request(app).post("/api/auth/register").send({
                name: "J",
                email: "not-an-email",
                password: "123",
            });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("returns 409 when registering with an already used email", async () => {
            await request(app).post("/api/auth/register").send(validUser);

            const res = await request(app).post("/api/auth/register").send(validUser);

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Email is already registered");
        });
    });

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            await request(app).post("/api/auth/register").send(validUser);
        });

        it("logs in an existing user with valid credentials", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: validUser.email,
                password: validUser.password,
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(res.body.user.email).toBe(validUser.email);
        });

        it("returns 401 for wrong password", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: validUser.email,
                password: "wrongpassword",
            });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("returns 401 for non-existent email", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "nobody@example.com",
                password: "password123",
            });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("returns 400 when login payload is invalid", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "bad-email",
            });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/auth/me", () => {
        it("returns the authenticated user profile", async () => {
            const registerRes = await request(app).post("/api/auth/register").send(validUser);
            const token = registerRes.body.token;

            const res = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user).toMatchObject({
                name: validUser.name,
                email: validUser.email,
            });
        });

        it("returns 401 without a token", async () => {
            const res = await request(app).get("/api/auth/me");
            expect(res.status).toBe(401);
        });

        it("returns 401 with an invalid token", async () => {
            const res = await request(app)
                .get("/api/auth/me")
                .set("Authorization", "Bearer invalid.jwt.token");
            expect(res.status).toBe(401);
        });
    });

    describe("PUT /api/auth/profile", () => {
        it("updates the authenticated user's name and email", async () => {
            const registerRes = await request(app).post("/api/auth/register").send(validUser);
            const token = registerRes.body.token;

            const res = await request(app)
                .put("/api/auth/profile")
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Jane Smith", email: "janesmith@example.com" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user).toMatchObject({
                name: "Jane Smith",
                email: "janesmith@example.com",
            });
        });

        it("returns 409 if the new email belongs to another user", async () => {
            const res1 = await request(app).post("/api/auth/register").send(validUser);
            await request(app).post("/api/auth/register").send({
                name: "Other User",
                email: "other@example.com",
                password: "password123",
            });

            const res = await request(app)
                .put("/api/auth/profile")
                .set("Authorization", `Bearer ${res1.body.token}`)
                .send({ email: "other@example.com" });

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
        });

        it("returns 400 when update payload is empty", async () => {
            const registerRes = await request(app).post("/api/auth/register").send(validUser);

            const res = await request(app)
                .put("/api/auth/profile")
                .set("Authorization", `Bearer ${registerRes.body.token}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});

