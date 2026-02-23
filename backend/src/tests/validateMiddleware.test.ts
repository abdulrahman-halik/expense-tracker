import Joi from 'joi';
import { createExpenseSchema, updateExpenseSchema } from '../middleware/validateMiddleware';

// ---------------------------------------------------------------------------
// createExpenseSchema
// ---------------------------------------------------------------------------
describe('createExpenseSchema', () => {
    const valid = {
        title: 'Lunch',
        amount: 12.5,
        category: 'Food',
        date: '2024-01-15T00:00:00.000Z',
        description: 'Lunch with team',
    };

    it('accepts a fully valid payload', () => {
        const { error } = createExpenseSchema.validate(valid);
        expect(error).toBeUndefined();
    });

    it('accepts payload without optional fields', () => {
        const { error } = createExpenseSchema.validate({
            title: 'Groceries',
            amount: 45,
            category: 'Food',
        });
        expect(error).toBeUndefined();
    });

    it('rejects missing title', () => {
        const { error } = createExpenseSchema.validate({ ...valid, title: undefined });
        expect(error).toBeDefined();
        expect(error!.details[0].message).toMatch(/Title is required/i);
    });

    it('rejects negative amount', () => {
        const { error } = createExpenseSchema.validate({ ...valid, amount: -5 });
        expect(error).toBeDefined();
        expect(error!.details[0].message).toMatch(/positive/i);
    });

    it('rejects invalid category', () => {
        const { error } = createExpenseSchema.validate({ ...valid, category: 'Gambling' });
        expect(error).toBeDefined();
        expect(error!.details[0].message).toMatch(/Category must be one of/i);
    });

    it('rejects description over 500 characters', () => {
        const { error } = createExpenseSchema.validate({ ...valid, description: 'x'.repeat(501) });
        expect(error).toBeDefined();
    });
});

// ---------------------------------------------------------------------------
// updateExpenseSchema
// ---------------------------------------------------------------------------
describe('updateExpenseSchema', () => {
    it('accepts a partial valid update', () => {
        const { error } = updateExpenseSchema.validate({ amount: 99.99 });
        expect(error).toBeUndefined();
    });

    it('rejects an empty object (min(1) rule)', () => {
        const { error } = updateExpenseSchema.validate({});
        expect(error).toBeDefined();
    });

    it('rejects invalid category on update', () => {
        const { error } = updateExpenseSchema.validate({ category: 'Unknown' });
        expect(error).toBeDefined();
        expect(error!.details[0].message).toMatch(/Category must be one of/i);
    });

    it('rejects empty string title', () => {
        const { error } = updateExpenseSchema.validate({ title: '' });
        expect(error).toBeDefined();
        expect(error!.details[0].message).toMatch(/empty/i);
    });
});
