import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { protect, AuthRequest } from "../../src/middleware/authMiddleware";
import * as userService from "../../src/services/userService";

jest.mock("../../src/services/userService");

const createMockRes = () => {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe("authMiddleware - protect (Unit)", () => {
    const originalSecret = process.env.JWT_SECRET;

    beforeEach(() => {
        process.env.JWT_SECRET = "unit-test-secret";
    });

    afterAll(() => {
        process.env.JWT_SECRET = originalSecret;
    });

    it("returns 401 when no Authorization header is provided", async () => {
        const req = { headers: {} } as AuthRequest;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await protect(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Not authorised – no token provided",
        });
    });

    it("returns 401 when Authorization header does not start with Bearer", async () => {
        const req = { headers: { authorization: "Basic abc123" } } as AuthRequest;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await protect(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it("returns 500 when JWT_SECRET is missing", async () => {
        delete process.env.JWT_SECRET;
        const req = { headers: { authorization: "Bearer some.jwt.token" } } as AuthRequest;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await protect(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Server configuration error",
        });
    });

    it("returns 401 when token is invalid", async () => {
        const req = { headers: { authorization: "Bearer invalid.token.here" } } as AuthRequest;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await protect(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Not authorised – token is invalid or expired",
        });
    });

    it("returns 401 when user from valid token no longer exists", async () => {
        const token = jwt.sign({ id: "507f1f77bcf86cd799439011" }, "unit-test-secret");
        (userService.findUserById as jest.Mock).mockResolvedValue(null);

        const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await protect(req, res, next);

        expect(userService.findUserById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Not authorised – user no longer exists",
        });
    });

    it("attaches req.user and calls next() when token and user are valid", async () => {
        const userId = "507f1f77bcf86cd799439011";
        const token = jwt.sign({ id: userId }, "unit-test-secret");
        (userService.findUserById as jest.Mock).mockResolvedValue({
            _id: { toString: () => userId },
            name: "Alice",
            email: "alice@example.com",
        });

        const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await protect(req, res, next);

        expect(req.user).toEqual({
            id: userId,
            name: "Alice",
            email: "alice@example.com",
        });
        expect(next).toHaveBeenCalledTimes(1);
    });
});

