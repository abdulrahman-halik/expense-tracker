import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { validate, createExpenseSchema, updateExpenseSchema } from '../middleware/validateMiddleware';
import {
    getExpenses,
    createExpenseHandler,
    updateExpenseHandler,
    deleteExpenseHandler,
} from '../controllers/expenseController';

const router = Router();

// All expense routes require authentication
router.use(protect);

// GET    /api/expenses          – list all expenses for the authenticated user
router.get('/', getExpenses);

// POST   /api/expenses          – create a new expense (validated)
router.post('/', validate(createExpenseSchema), createExpenseHandler);

// PUT    /api/expenses/:id      – update an expense (validated, ownership checked)
router.put('/:id', validate(updateExpenseSchema), updateExpenseHandler);

// DELETE /api/expenses/:id      – delete an expense (ownership checked)
router.delete('/:id', deleteExpenseHandler);

export default router;
