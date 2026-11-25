import mongoose from "mongoose";
import {
    createExpense,
    getExpensesByUser,
    getExpenseById,
    updateExpenseById,
    deleteExpenseById,
} from "../../src/services/expenseService";
import { createUser } from "../../src/services/userService";
import { connectTestDB, clearTestDB, closeTestDB } from "../helpers/db";

let userId: string;
let otherUserId: string;

beforeAll(async () => {
    await connectTestDB();
});

beforeEach(async () => {
    await clearTestDB();
    const user1 = await createUser("User One", "user1@example.com", "hash1");
    const user2 = await createUser("User Two", "user2@example.com", "hash2");
    userId = user1._id.toString();
    otherUserId = user2._id.toString();
});

afterAll(async () => {
    await closeTestDB();
});

describe("expenseService (Integration)", () => {
    it("creates an expense with trimmed strings and default type", async () => {
        const expense = await createExpense(userId, {
            title: "  Morning Coffee  ",
            amount: 4.5,
            category: "  Food  ",
            type: "expense",
            note: "  Latte  ",
        });

        expect(expense.title).toBe("Morning Coffee");
        expect(expense.category).toBe("Food");
        expect(expense.note).toBe("Latte");
        expect(expense.amount).toBe(4.5);
        expect(expense.user.toString()).toBe(userId);
    });

    it("filters expenses by user, category, type, title search, and date range", async () => {
        await createExpense(userId, {
            title: "Grocery Store",
            amount: 80,
            category: "Food",
            type: "expense",
            date: new Date("2026-02-10T10:00:00Z"),
        });
        await createExpense(userId, {
            title: "Monthly Salary",
            amount: 3000,
            category: "Salary",
            type: "income",
            date: new Date("2026-02-01T10:00:00Z"),
        });
        await createExpense(userId, {
            title: "Old Dinner",
            amount: 50,
            category: "Food",
            type: "expense",
            date: new Date("2025-12-01T10:00:00Z"),
        });
        await createExpense(otherUserId, {
            title: "Other User Food",
            amount: 25,
            category: "Food",
            type: "expense",
            date: new Date("2026-02-10T10:00:00Z"),
        });

        const byCategory = await getExpensesByUser(userId, { category: "Food" });
        expect(byCategory.total).toBe(2);

        const byType = await getExpensesByUser(userId, { type: "income" });
        expect(byType.total).toBe(1);
        expect(byType.data[0].title).toBe("Monthly Salary");

        const bySearch = await getExpensesByUser(userId, { title: "grocery" });
        expect(bySearch.total).toBe(1);
        expect(bySearch.data[0].title).toBe("Grocery Store");

        const byDateRange = await getExpensesByUser(userId, {
            startDate: new Date("2026-02-01T00:00:00Z"),
            endDate: new Date("2026-02-28T23:59:59Z"),
        });
        expect(byDateRange.total).toBe(2);
    });

    it("supports sorting and pagination", async () => {
        await createExpense(userId, { title: "A", amount: 10, category: "Food", type: "expense" });
        await createExpense(userId, { title: "B", amount: 30, category: "Food", type: "expense" });
        await createExpense(userId, { title: "C", amount: 20, category: "Food", type: "expense" });

        const page1 = await getExpensesByUser(userId, {
            sortBy: "amount",
            sortOrder: "asc",
            page: 1,
            limit: 2,
        });
        expect(page1.total).toBe(3);
        expect(page1.totalPages).toBe(2);
        expect(page1.data.map((e) => e.amount)).toEqual([10, 20]);

        const page2 = await getExpensesByUser(userId, {
            sortBy: "amount",
            sortOrder: "asc",
            page: 2,
            limit: 2,
        });
        expect(page2.data.map((e) => e.amount)).toEqual([30]);
    });

    it("gets, updates, and deletes an expense by ID", async () => {
        const created = await createExpense(userId, {
            title: "Train",
            amount: 15,
            category: "Transport",
            type: "expense",
        });

        const fetched = await getExpenseById(created._id.toString());
        expect(fetched?.title).toBe("Train");

        const updated = await updateExpenseById(created._id.toString(), {
            title: "Express Train",
            amount: 25,
        });
        expect(updated?.title).toBe("Express Train");
        expect(updated?.amount).toBe(25);

        const deleted = await deleteExpenseById(created._id.toString());
        expect(deleted?._id.toString()).toBe(created._id.toString());

        const afterDelete = await getExpenseById(created._id.toString());
        expect(afterDelete).toBeNull();
    });

    it("returns null when deleting a non-existent expense ID", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const deleted = await deleteExpenseById(fakeId);
        expect(deleted).toBeNull();
    });
});

