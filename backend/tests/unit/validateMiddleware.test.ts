import { Request, Response, NextFunction } from "express";
import {
    validate,
    createExpenseSchema,
    updateExpenseSchema,
} from "../../src/middleware/validateMiddleware";

const createMockRes = () => {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe("validateMiddleware (Unit)", () => {
    describe("createExpenseSchema", () => {
        it("calls next() for a valid expense payload", () => {
            const req = {
                body: {
                    title: "Groceries",
                    amount: 55.5,
                    category: "Food",
                    type: "expense",
                    date: "2026-01-15T10:00:00.000Z",
                    note: "Weekly shopping",
                },
            } as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            validate(createExpenseSchema)(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
        });

        it("allows optional fields (type, date, note) to be omitted", () => {
            const req = {
                body: {
                    title: "Bus ticket",
                    amount: 3.5,
                    category: "Transport",
                },
            } as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            validate(createExpenseSchema)(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        it("returns 400 when title is missing", () => {
            const req = {
                body: { amount: 20, category: "Food" },
            } as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            validate(createExpenseSchema)(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Title is required",
            });
        });

        it("returns 400 when amount is zero or negative", () => {
            const req = {
                body: { title: "Coffee", amount: -5, category: "Food" },
            } as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            validate(createExpenseSchema)(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Amount must be a positive number",
            });
        });

        it("returns 400 when category is not in the allowed list", () => {
            const req = {
                body: { title: "Gadget", amount: 99, category: "InvalidCategory" },
            } as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            validate(createExpenseSchema)(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: expect.stringContaining("Category must be one of:"),
                })
            );
        });

        it("returns 400 when note exceeds 500 characters", () => {
            const req = {
                body: {
                    title: "Dinner",
                    amount: 40,
                    category: "Food",
                    note: "a".repeat(501),
                },
            } as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            validate(createExpenseSchema)(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe("updateExpenseSchema", () => {
        it("calls next() for a valid partial update", () => {
            const req = { body: { amount: 120 } } as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            validate(updateExpenseSchema)(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        it("returns 400 when update payload is empty", () => {
            const req = { body: {} } as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            validate(updateExpenseSchema)(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("returns 400 when update payload has invalid type", () => {
            const req = { body: { type: "transfer" } } as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            validate(updateExpenseSchema)(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});

