import { Request, Response, NextFunction } from "express";
import { AppError, errorHandler } from "../../src/middleware/errorMiddleware";

const createMockRes = () => {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe("errorMiddleware (Unit)", () => {
    const mockReq = {} as Request;
    const mockNext = jest.fn() as NextFunction;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("handles AppError with its custom statusCode and message", () => {
        const res = createMockRes();
        const err = new AppError("Expense not found", 404);

        expect(err.isOperational).toBe(true);
        expect(err.statusCode).toBe(404);

        errorHandler(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 404,
            message: "Expense not found",
        });
    });

    it("handles Mongoose CastError as 400 Invalid ID format", () => {
        const res = createMockRes();
        const err = new Error("Cast to ObjectId failed");
        err.name = "CastError";

        errorHandler(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            message: "Invalid ID format",
        });
    });

    it("handles duplicate key error (code '11000') as 409", () => {
        const res = createMockRes();
        const err = new Error("E11000 duplicate key") as NodeJS.ErrnoException;
        err.code = "11000";

        errorHandler(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 409,
            message: "Duplicate field value – resource already exists",
        });
    });

    it("handles JsonWebTokenError as 401 Invalid token", () => {
        const res = createMockRes();
        const err = new Error("jwt malformed");
        err.name = "JsonWebTokenError";

        errorHandler(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 401,
            message: "Invalid token",
        });
    });

    it("handles TokenExpiredError as 401 Token has expired", () => {
        const res = createMockRes();
        const err = new Error("jwt expired");
        err.name = "TokenExpiredError";

        errorHandler(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 401,
            message: "Token has expired",
        });
    });

    it("handles unknown errors as 500 Internal server error", () => {
        const res = createMockRes();
        const err = new Error("Unexpected crash");

        errorHandler(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 500,
            message: "Internal server error",
        });
    });
});

