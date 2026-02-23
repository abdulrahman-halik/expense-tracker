import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
    title: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
    date: Date;
    note?: string;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
}

const ExpenseSchema: Schema = new Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true, default: 'expense' },
    date: { type: Date, default: Date.now },
    note: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
