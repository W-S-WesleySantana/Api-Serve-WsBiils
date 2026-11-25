import type{ TransactionType } from "@prisma/client";
import type{ CategorySumary } from "./category.types";



export interface TransactionFilter {

    userId: string;
    date?: {
        gte: Date;
        lte: Date;
    },

    type?: TransactionType;
    categoryId?: string;
}

export interface transacrionsSumary {
    
    totalIncome: number;
    totalExpense: number;
    balance: number;
    expenseByCategory: CategorySumary[];
}