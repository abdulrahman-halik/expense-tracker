import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { validate, createExpenseSchema, updateExpenseSchema } from '../middleware/validateMiddleware';
import {
    getExpenses,
    createExpenseHandler,
    updateExpenseHandler,
    deleteExpenseHandler,
    getStatsHandler,
} from '../controllers/expenseController';

const router = Router();

router.use(protect);

// GET    /api/expenses/stats   (must come before /:id)
router.get('/stats', getStatsHandler);

// GET    /api/expenses
router.get('/', getExpenses);

// POST   /api/expenses
router.post('/', validate(createExpenseSchema), createExpenseHandler);

// PUT    /api/expenses/:id
router.put('/:id', validate(updateExpenseSchema), updateExpenseHandler);

// DELETE /api/expenses/:id
router.delete('/:id', deleteExpenseHandler);

export default router;
