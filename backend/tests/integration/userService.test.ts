import mongoose from "mongoose";
import {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserById,
} from "../../src/services/userService";
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

describe("userService (Integration)", () => {
    it("creates a user with trimmed name and lowercased email", async () => {
        const user = await createUser("  Jane Doe  ", "  JANE@Example.COM ", "hashed-pass");

        expect(user._id).toBeDefined();
        expect(user.name).toBe("Jane Doe");
        expect(user.email).toBe("jane@example.com");
    });

    it("findUserByEmail returns user including password field (case-insensitive)", async () => {
        await createUser("John", "john@example.com", "secret-hash");

        const found = await findUserByEmail("  JOHN@EXAMPLE.COM ");
        expect(found).not.toBeNull();
        expect(found!.email).toBe("john@example.com");
        expect(found!.password).toBe("secret-hash");
    });

    it("findUserById returns user without password field", async () => {
        const created = await createUser("Alice", "alice@example.com", "secret-hash");

        const found = await findUserById(created._id.toString());
        expect(found).not.toBeNull();
        expect(found!.name).toBe("Alice");
        expect(found!.password).toBeUndefined();
    });

    it("updateUserById updates name and email and excludes password", async () => {
        const created = await createUser("Bob", "bob@example.com", "secret-hash");

        const updated = await updateUserById(created._id.toString(), {
            name: "  Robert  ",
            email: "  ROBERT@Example.com ",
        });

        expect(updated).not.toBeNull();
        expect(updated!.name).toBe("Robert");
        expect(updated!.email).toBe("robert@example.com");
        expect(updated!.password).toBeUndefined();
    });

    it("updateUserById returns null for a non-existent ObjectId", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const updated = await updateUserById(fakeId, { name: "Ghost" });
        expect(updated).toBeNull();
    });
});

