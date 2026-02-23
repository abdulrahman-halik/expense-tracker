import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

/**
 * Generic validation middleware factory.
 * Validates req.body against the provided Joi schema.
 * Returns 400 with the first validation error message if invalid.
 */
export const validate =
    (schema: Joi.ObjectSchema) =>
        (req: Request, res: Response, next: NextFunction): void => {
            const { error } = schema.validate(req.body, { abortEarly: true });
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            next();
        };

// ---------------------------------------------------------------------------
// Expense Joi Schemas
// ---------------------------------------------------------------------------

const VALID_CATEGORIES = [
    'Food',
    'Transport',
    'Housing',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Education',
    'Utilities',
    'Other',
];

export const createExpenseSchema = Joi.object({
    title: Joi.string().min(1).max(100).required().messages({
        'string.empty': 'Title cannot be empty',
        'any.required': 'Title is required',
    }),
    amount: Joi.number().positive().required().messages({
        'number.positive': 'Amount must be a positive number',
        'any.required': 'Amount is required',
    }),
    category: Joi.string()
        .valid(...VALID_CATEGORIES)
        .required()
        .messages({
            'any.only': `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
            'any.required': 'Category is required',
        }),
    date: Joi.date().iso().optional(),
    description: Joi.string().max(500).optional().allow(''),
});

export const updateExpenseSchema = Joi.object({
    title: Joi.string().min(1).max(100).optional().messages({
        'string.empty': 'Title cannot be empty',
    }),
    amount: Joi.number().positive().optional().messages({
        'number.positive': 'Amount must be a positive number',
    }),
    category: Joi.string()
        .valid(...VALID_CATEGORIES)
        .optional()
        .messages({
            'any.only': `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
        }),
    date: Joi.date().iso().optional(),
    description: Joi.string().max(500).optional().allow(''),
}).min(1); // At least one field must be present on update
