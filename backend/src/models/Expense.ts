import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
    title: string;
    amount: number;
    category: string;
    date: Date;
    description?: string;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
}

const ExpenseSchema: Schema = new Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
